// 权限拦截，路由导航守卫
import router from './router'
import store from './store'
import nprogress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
// 设置白名单
const whilteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nprogress.start() // 开启进度条
  // 判断有没有token
  // 需要获取store中的token，在userm模块中，但是在store1中设置了getters快捷访问
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.state.user.userInfo.userId) {
        console.log('获取用户信息')
        //   没有获取过用户信息，开始获取用户信息
        // result 是返回的用户信息数据
        const { roles } = await store.dispatch('user/getUserInfo')

        // 调用vuex permission m模块筛选出用户可用的路由权限
        // 这里面得第二个参数是用户信息里面的roles.menus
        // routes 是筛选得到的动态路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        console.log('动态路由', routes)
        // 调用router实例的addRoutes()方法 添加动态路由到路由表
        // 错误页面404必须放到所有路由之后，所以要加在这个地方
        router.addRoutes([...routes], // 404 page must be placed at the end !!!
          { path: '*', redirect: '/404', hidden: true })
        next(to.path) // 必须要调用to.path实现跳转
      } else {
        next()
      }
    }
  } else {
    //   是否在白名单
    if (whilteList.includes(to.path)) {
    // 在白名单直接方形
      next()
    } else {
      // 跳转到登录页
      next('/login')
    }
  }
  nprogress.done() // 关闭进度条,强制关闭
})
// 后置守卫
router.afterEach(() => {
  nprogress.done() // 关闭进度条
})
