<template>
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
// var echarts = require('echarts')
// 引入echarts主模块
var echarts = require('echarts/lib/echarts')
// 引入雷达图
require('echarts/lib/chart/radar')
// 引入提示框和表土组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  created() {
    // vue实例创建完毕，但是页面没有创建完毕
  },
  mounted() {
    //   页面挂在dom完成s
    const myEcharts = echarts.init(this.$refs.myDiv) // 获取图表实例
    const option = {
      title: {
        text: 'Basic Radar Chart'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自住学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [10, 0, 30, 50, 80, 10],
              name: '张三'
            },
            {
              value: [100, 100, 100, 100, 100, 100],
              name: '李四'
            }
          ]
        }
      ]
    }
    myEcharts.setOption(option)
  }
}
</script>

<style>
.radar-echart {
    width: 600px;
    height: 400px;
}
</style>
