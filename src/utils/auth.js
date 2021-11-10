import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'

const TimeKey = 'hrsaas-ihrm-time' // 时间戳key

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTime() {
  return Cookies.get(TimeKey)
}

export function setTime() {
  return Cookies.set(TimeKey, Date.now())
}
