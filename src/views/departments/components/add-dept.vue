<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" :before-close="cancle">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getSimpleInfo">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="cancle">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDeptDetail, updateDepartments } from '@/api/departments'
import { getSimpleInfo } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    //   检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      // value 要和同一级别部门进行比较
      // 调用获取部门数据的接口获取最新的部门数据
      const { depts } = await getDepartments()

      let isRepeat
      if (this.showTitle) {
        // 有ID说命名是编辑，需要编辑的验证规则
        // 需要判断我的名字和同级别的其他部门名称不能重复,depts包含是数据库中所有数据，所以要先把我自己名字排除掉
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.pid).some(item => item.name === this.formData.name)
      } else {
        // 使用数组过滤方法根据treeNode中的ID来过滤获取改部门下的所有的子部门，ID=>PID, 使用some查查是否找到相同元素
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => value === item.name)
      }
      isRepeat ? callback(new Error(`同级部门已经存在${value}部门，请更换部门名称`)) : callback()
    }
    // 检查部门编码是否重复
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat
      if (this.showTitle) {
        // 有ID 说明是编辑规则
        // 排除自己的code,跟同级别的其他部门比较
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`已经存在的部门编码${value},请更换编码后重试！`)) : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' }, {
            trigger: 'blur',
            validator: checkNameRepeat // 自定义函数的形式校验
          }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' }, {
            trigger: 'blur',
            validator: checkCodeRepeat
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      peoples: []

    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getSimpleInfo() {
      this.peoples = await getSimpleInfo()
    },
    // 提交数据
    submit() {
      this.$refs.deptForm.validate(async isok => {
        if (isok) {
          if (this.showTitle) {
            await updateDepartments(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          //   到这边说明执行resolve，请求成功告诉父组件更新重新获取数据
          this.$emit('addDeptSuccess')
          this.$emit('update:showDialog', false)
        }
      })
    },
    // 取消
    cancle() {
    //   重置表单数据
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      //   清除之前的校验数据
      this.$refs.deptForm.resetFields()
    },
    // 获取详情方法
    async getDeptDetail(id) {
      this.formData = await getDeptDetail(id)
    //   这里不能使用treeNode,因为props传值是异步的，在调用时候可能node还没有传过来
    }
  }
}
</script>

<style lang="sass" scoped>

</style>>
