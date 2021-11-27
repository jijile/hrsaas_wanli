<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- 多选框 -->
    <el-checkbox-group v-model="roleIds">
      <!-- 循环选项 -->
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRolesList } from '@/api/setting'
import { getUserDetailByID } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null,
      required: true
    }
  },
  data() {
    return {
      roleList: [], // 角色列表数组
      roleIds: []
    }
  },
  created() {
    //   获取所有角色列表
    debugger
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      debugger
      const { rows } = await getRolesList({ page: 1, pagesize: 20 })
      this.roleList = rows
      console.log(this.roleList)
    },
    async getUserDetailByID(id) {
    //   props传值是异步的，所以这里不能直接使用this.userId
    // 这个方法也是给父组件调用的
      const { roleIds } = await getUserDetailByID(id)
      this.roleIds = roleIds
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      this.roleIds = [] // 重置数组，将他还原成空对象
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style>

</style>
