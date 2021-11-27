import { getToken, setToken, removeToken, setTime } from '@/utils/auth'
import { login, getUserInfo, getUserDetailByID } from '@/api/user'
import { resetRouter } from '@/router'
// 放置状态
const state = {
  token: getToken(), //  设置token共享状态，初始化vuex的时候 就先从缓存中读取
  userInfo: {} // 用户信息对象
}
const mutations = {
  //  token数据变化更新state数据
  setUserToken(state, token) {
    console.log(token)
    state.token = token
    // 当token变化时候把token同步给store
    setToken(token)
  },
  // 删除token
  removeToken(state) {
    state.token = null
    removeToken()
  },
  // 更新设置用户信息
  setUserInfo(state, result) {
    state.userInfo = result
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    const result = await login(data) //  获取token
    context.commit('setUserToken', result) //  设置token
    // 拿到token时候保存时间戳
    setTime()
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户详情
    const baseInfo = await getUserDetailByID(result.userId)
    const obj = { ...result, ...baseInfo }
    context.commit('setUserInfo', obj) // 提交mutations
    return result
  },
  // 登出操作
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    // 调用路由中的方法重置路由
    resetRouter()
    // 设置vuex permmission中的routes的出事状态
    // vuex 子模块调用子模块，如果不加锁情况下 可以随意调用，但是加了命名空间如何调用
    // 调用时候需要添加第三个参数{ root: true }
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
