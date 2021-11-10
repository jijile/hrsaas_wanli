import Layout from '@/layout'
// 员工的路由规则
export default {
  path: '/attendances',
  name: 'attendances', // 做权限管理时候会用到
  component: Layout,
  children: [{
    path: '', // path中什么都不写表示二级路由的默认路由
    component: () => import('@/views/attendances'), // 按需导入
    meta: {
      title: '考勤',
      icon: 'skill'
    }
  }]
}
