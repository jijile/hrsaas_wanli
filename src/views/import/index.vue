<template>
  <!-- 父组件传入给子组件一个函数用来处理子组件的回调数据 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async success({ header, results }) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const newDataArr = results.map(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            //   后端接口限制只能转换成日期格式
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          }
          userInfo[userRelations[key]] = item[key]
        })
        return userInfo
      })
      //   发送上传请求
      await importEmployee(newDataArr)
      this.$message.success('导入成功！')
      //   返回上一个页面
      this.$router.back()
    },
    // 转换Excel日期
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
