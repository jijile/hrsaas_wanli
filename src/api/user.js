import request from '@/utils/request'

// 登录接口的封装
export function login(data) {
  // 返回一个promise对象
  return request({
    url: '/sys/login',
    method: 'post',
    data
  }
  )
}

// 获取用户资料接口
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 根据用户ID获取用户详情
export function getUserDetailByID(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {
}
