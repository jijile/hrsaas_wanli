// 处理权限路由模块,
// asyncRouters 所有的动态路由
import { constantRoutes, asyncRouters } from '@/router'
const state = {
  routes: constantRoutes // 路由表 表示当前用户所拥有的所有的路由
}
const mutations = {
//   定义修改routes的mutations
// payload 是登陆成功之后需要添加的路由表
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
//  筛选权限路由
// 第二个参数用户所有的菜单权限
//  menus: ["settings","perssions"]
  filterRoutes(context, menus) {
    console.log('菜单列表', menus)
    const routes = []
    menus.forEach(key => {
      routes.push(...asyncRouters.filter(obj => obj.name === key))
    })
    // routes 是所有用户拥有的路由页面模块
    // 更新mutations中的state
    context.commit('setRoutes', routes)
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
