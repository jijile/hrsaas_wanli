<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="operateDeparts">
            <span>操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  // 传入的属性
  props: {
    // eslint-disable-next-line vue/require-default-prop
    treeNode: {
      require: true,
      type: Object
    },
    // 是否是根节点
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    operateDeparts(command) {
      if (command === 'add') {
        //   添加子部门
        // 通知父组件添加部门弹框
        this.$emit('addDepts', this.treeNode)
      } else if (command === 'edit') {
        //   编辑子部门
        this.$emit('editDepts', this.treeNode)
      } else {
        //   删除子部门
        this.$confirm('您确定要删除该组织架构吗？').then(() => {
          alert('用户点击了删除')
          //   调动删除接口
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 触发自定义事件告诉父组件更新数据
          this.$emit('delDepts')
          this.$message.success('删除部门成功！')
        })
      }
    }
  }
}
</script>
