<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
        </template>
      </page-tools>
      <el-table border="" :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" align="center" prop="code" />
        <el-table-column label="描述" align="center" prop="description" />
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="addPermission(2, row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增和编辑弹层 -->
    <el-dialog :visible="showDialog" :title="showText" @close="btnCancel">
      <el-form ref="addPermissionRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch v-model="formData.enVisible" inactive-value="0" active-value="1" style="width: 90%" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, delPermission, addPermission, updatePermission, getPermissionDetail } from '@/api/permission'
import { trandListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      showDialog: false, // 显示或者关闭弹层标志
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '1' // 开启
      },
      rules: { name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }], code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }] }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = trandListToTreeData(await getPermissionList(), '0')
    },
    // 删除
    delPermission(id) {
      this.$confirm('确认删除该权限吗？').then(() => {
        return delPermission(id)
      }).then(() => {
        this.$message.success('删除成功！')
        // 刷新数据
        this.getPermissionList()
      })
    },
    // 添加
    addPermission(type, pid) {
      this.showDialog = true
      this.formData.type = type
      this.formData.pid = pid
    },
    btnOK() {
      this.$refs.addPermissionRef.validate().then(() => {
        // 规则验证通过提交添加
        if (this.formData.id) {
          return updatePermission(this.formData)
        } else {
          return addPermission(this.formData)
        }
      }).then(() => {
        this.$message.success('操作成功')
        // 添加成功，刷新数据
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancel() {
      // 重置表单
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '1' // 开启
      }
      // 移除校验
      this.$refs.addPermissionRef.resetFields()
      // 关闭弹层
      this.showDialog = false
    },
    // 编辑
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)

      this.showDialog = true
    }
  }
}
</script>

<style>

</style>
