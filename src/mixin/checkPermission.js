import store from '@/store'
// 混入对象
export default {
  methods: {
    //   检查权限
    checkPermission(key) {
      // 去用户信心里面查找有没有key权限 返回boolen
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        console.log('权限点', userInfo.roles.points)
        //   找到对应的的point说明有权限返回true
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
