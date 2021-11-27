<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ total }}条记录</span>
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" :disabled="!checkPermission('POINT-USER-ADD')" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <el-card>
        <el-table v-loading="loading" border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="mobile" label="手机号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column width="120px" label="头像" align="center">
            <template v-slot="{ row }">
              <img v-imageerror="require('@/assets/common/head.jpg')" :src="row.staffPhoto" alt="" style="border-radius: 50%; width: 100px; height: 100px; padding: 10px" @click="showQrCode(row.staffPhoto)">
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column prop="formOfEmployment" :formatter="formatEmployment" label="聘用形式" sortable="" />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <!-- 使用作用域插槽+过滤器处理 -->
          <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
            <!-- <templat slot-scope="{ row }"></templat> -->
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="">
            <template v-slot="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="lookUserInfo(row.id)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination layout="prev, pager, next" :current-page="page.page" :page-size="page.size" :total="total" @current-change="changePage" />
        </el-row>
      </el-card>
      <!-- sync修饰符子组件改变父组件数据的语法糖 -->
      <add-employee :show-dialog.sync="showDialog" />
    </div>
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 显示分配角色组件 -->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import employeeEnum from '@/api/constant/employees' // 引入员工的额枚举类型
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
import QRCode from 'qrcode'
import AssignRole from './components/assign-role.vue'
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      list: [], // 接受数据
      page: {
        page: 1,
        size: 10
      },
      total: 0, // 总数
      loading: false, // 控制显示加载遮罩UI
      showDialog: false,
      showCodeDialog: false, // 显示二维码弹层
      showRoleDialog: false, // 显示分配角色按钮
      userId: '' // userID
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.total = total
      this.loading = false
    },
    // 切换页码事件,newPage参数是最新的页码
    changePage(newPage) {
      this.page.page = newPage // 赋值最新的页码
      this.getEmployeeList() // 拉去页码数据
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      const result = employeeEnum.hireType.find(item => item.id === cellValue)
      return result ? result.value : '未知'
    },
    // 删除事件
    async delEmployee(id) {
      try {
        await this.$confirm('确定删除该员工？')
        // 调用删除接口
        await delEmployee(id)
        this.$message.success('删除成功！')
        // 拉取数据
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    // 导出Excel
    exportData() {
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载按需导入
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取所有的数据
        const { rows } = await getEmployeeList({ page: 1, size: this.total })
        console.log(rows)
        const data = this.formatJson(rows, headers) // 格式化数据
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formatJson(rows, header) {
      return rows.map(item => {
        return Object.keys(header).map(key => {
          // 处理时间和聘用形式
          if (header[key] === 'timeOfEntry' || header[key] === 'correctionTime') {
            return formatDate(item[header[key]])
          } else if (header[key] === 'formOfEmployment') {
            const obj = employeeEnum.hireType.find(obj => obj.id === item[header[key]])
            return obj ? obj.value : '未知'
          }
          return item[header[key]]
        })
      })
    },
    lookUserInfo(id) {
      this.$router.push(`/employees/detail/${id}`)
    },
    showQrCode(url) {
      if (url) {
        this.showCodeDialog = true
        // 下一次更新循环结束之后调用此方法获取更新后的dom节点
        this.$nextTick(() => {
          QRCode.toCanvas(this.$refs.myCanvas, url) // 将地址转换成二维码
        })
      } else {
        this.$message.warning('该用户还没有上传头像')
      }
    },
    // 编辑角色事件
    editRole(id) {
      // 先把ID赋值过去
      this.userId = id
      // 调用组件中的方法获取角色列表
      this.$refs.assignRole.getUserDetailByID(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style>

</style>
