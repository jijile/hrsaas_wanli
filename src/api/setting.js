import request from '@/utils/request'
/*
*获取角色列表
*/
export function getRolesList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 * 获取公司信息
 * */
export function getCompanyInfo(companyId) {
  return request({
    url: '/company/' + companyId
  })
}
// 删除角色
export function deleteRole(roleId) {
  return request({
    url: `/sys/role/${roleId}`,
    method: 'delete'
  })
}
/**
 * 读取角色详情
 * */
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
/**
 * 更新角色
*/
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * 新增角色
*/export function addRole(data) {
  console.log('数据', data)
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}
// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}

