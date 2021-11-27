<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height: 60px">
              <el-button size="small" type="primary" icon="el-icon-plus" @click="showDialog=true">新增角色</el-button>
            </el-row>
            <el-table border="" :data="list">
              <el-table-column type="index" label="序号" width="120" align="center">
                <!--  -->
              </el-table-column>
              <el-table-column prop="name" label="名称" width="240" align="center">
                <!--  -->
              </el-table-column>
              <el-table-column prop="description" label="描述">
                <!--  -->
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑权限</el-button>
                  <el-button size="small" type="danger" @click="dleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <el-pagination layout="prev, pager, next" :total="total" :page-size="page.pagesize" :current-page="page.page" @current-change="changePage">
                <!--  -->
              </el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert title="一下信息不能修改" type="info" :show-icon="true" :closable="false" />
            <!-- 公司信息 -->
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" rows="3" disabled style="width: 400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置一个弹层组件 -->
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCncel">
      <el-form ref="roleRef" label-width="120px" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- footer 插槽 -->
      <el-row slo type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCncel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <el-tree ref="permTreeRef" :data="permData" :props="defaultProps" :show-checkbox="true" :check-strictly="true" :default-expand-all="true" :default-checked-keys="selectCheck" node-key="id" />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="smalll" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermissionList } from '@/api/permission'
import { trandListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      page: {
        // 放置页码以及相关数据
        page: 1,
        pagesize: 2
      },
      total: 0,
      formData: {
        // 公司信息
      },
      permData: [], // 接收权限数据
      defaultProps: {
        label: 'name' // 映射当前权限点的标识
      },
      selectCheck: [], // 记录当前选中的权限节点
      roleId: null, // 用来记录当前分配权限的ID
      showDialog: false, // 控制编辑弹层显示
      showPermDialog: false, // 控制权限分配弹层显示
      roleForm: {
        name: '',
        description: ''
      },
      rules: { name: [{ required: true, message: '角色名称不能为空！', trigger: 'blur' }] }
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    // 根据id判断是编辑还是新增
    isEdit() {
      return this.roleForm.id
    }
  },
  created() {
    this.getRolesList() // 获取角色列表
    this.getCompanyInfo() // 获取公司信息
  },
  methods: {
    async getRolesList() {
      const { total, rows } = await getRolesList(this.page)
      this.total = total
      this.list = rows
      console.log(rows)
    },
    // 获取公司信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    changePage(newPage) {
      // newpage 是当前点击的page
      this.page.page = newPage
      this.getRolesList()
    },
    async dleteRole(id) {
      // 提示
      try {
        await this.$confirm('确认删除该角色吗？')
        // 删除
        await deleteRole(id)
        this.getRolesList() // 刷新数据
        this.$message.success('删除角色信息成功')
      } catch (error) {
        // 取消
      }
    },
    // 编辑
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) // 将获取数据赋值给字段
      this.showDialog = true // 显示弹层在获取数据之后执行
    },
    btnCncel() {
      this.roleForm = { name: '', description: '' }
      this.showDialog = false
      this.$refs.roleRef.resetFields() // 重置表单验证包括验证规则
    },
    async btnOk() {
      try {
        await this.$refs.roleRef.validate()
        // 只有校验通过才会执行下面的
        if (this.isEdit) {
          console.log('编辑')
          // 编辑
          await updateRole(this.roleForm)
        } else {
          console.log('新增')
          // 新增
          await addRole(this.roleForm)
        }
        // 成功更新数据
        this.getRolesList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (error) {
        console.log('校验失败')
      }
    },
    async assignPerm(id) {
      this.permData = trandListToTreeData(await getPermissionList(), '0') // 将获取到的权限列表转换成树形结构
      this.roleId = id
      // 首先需要获取当前角色的权限点
      const { permIds } = await getRoleDetail(id)
      // 保存起来
      this.selectCheck = permIds
      // 弹层
      this.showPermDialog = true
    },
    async btnPermOK() {
      // console.log(this.$refs.permTreeRef.getCheckedKeys(), '---', this.roleId)
      await assignPerm({ permIds: this.$refs.permTreeRef.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.selectCheck = []
      this.showPermDialog = false
    }
  }
}
</script>

<style>

</style>
