import request from '@/utils/request'

// 获取组织架构的数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
/**
 * 删除部门组织架构
 * **/

export function delDepartments(id) {
  return request({
    url: '/company/department/' + id,
    method: 'delete'
  })
}
/**
 * 添加部门
 * */

export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
/**
 * 获取部门详情
*/
export function getDeptDetail(id) {
  return request({
    url: '/company/department/' + id
  })
}

/**
 * 保存编辑
*/
export function updateDepartments(data) {
  return request({
    url: '/company/department/' + data.id,
    method: 'put',
    data
  })
}

