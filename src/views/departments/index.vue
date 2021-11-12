<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构头部 -->
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <tree-tools slot-scope="{ data }" :tree-node="data" @addDepts="addDepts" @delDepts="getDepartments" @editDepts="editDepts" />
        </el-tree>
      </el-card>
      <!-- 新增部门弹框 -->
      <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDeptSuccess="getDepartments" />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { trandListToTreeData } from '@/utils/index'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {},
      defaultProps: {
        label: 'name'
      },
      departs: [],
      // 控制显示dialog
      showDialog: false,
      // 需要添加组织部门的节点
      node: null,
      // 控制获取数据进度的弹层的显示和隐藏
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      console.log(result)
      // id:''是为了后面在添加根部门时候校验判断是否存在相同的部门id=>PID=''
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = trandListToTreeData(result.depts, '')
      this.loading = false
    },
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      // 调用子组件的方法获取数据，因为数据是显示在子组件的，这样比较解耦
      console.log(this.$refs.addDept)
      this.$refs.addDept.getDeptDetail(this.node.id)
    }
  }
}
</script>

<style>
.tree-card {
  padding: 30px 40px;
  font-size: 14px;
}
</style>
