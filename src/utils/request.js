import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from '@/utils/auth'
import router from '@/router'
const TimeOut = 3600 // 超时时间
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 设置配置信息
  if (store.getters.token) {
    if (ISCheckTimeout()) {
      console.log('无效token')
      //   调用登出操作删除哟用户数据
      store.dispatch('user/logout')
      //   路由跳转奥登录页
      router.push('/login')
      //   返回错误promise
      return Promise.reject(new Error('无效token'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  Message.error(error.message)
  return Promise.reject(error)
})

// 响应快拦截器
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error && error.response && error.response.data.code === 10002) {
    console.log('token 后台超时')
    // 后端返回token超时
    store.dispatch('user/logout') // 登出清除数据
    router.push('/login') // 跳转到登录页
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error) // 跳出执行链，进入catch
})

function ISCheckTimeout() {
  const currentTime = Date.now()
  const timeStamp = getTime()
  console.log(currentTime, timeStamp)
  return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service
