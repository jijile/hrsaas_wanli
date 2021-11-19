import Layout from '@/layout'
// 员工的路由规则
export default {
  path: '/employees',
  name: 'employees', // 做权限管理时候会用到
  component: Layout,
  children: [{
    path: '', // path中什么都不写表示二级路由的默认路由
    component: () => import('@/views/employees'), // 按需导入
    meta: {
      title: '员工',
      icon: 'people'
    }
  }, {
    path: 'detail/:id', // 动态路由传参，？表示可以传可以不传
    component: () => import('@/views/employees/detail'),
    meta: {
      title: '员工详情'
    },
    hidden: true // 不显示在左侧菜单中
  }]
}
