import request from '@/network/request-method'

/**
 * 登录
 * @param {String} username 用户名
 * @param {String} password 密码
 */
export function login (username, password) {
  const url = 'user/login'
  return request.get(url,{username,password})
}
/**
 * 注册
 * @param {String} username 用户名
 * @param {String} password 密码
 */
export function register(username,password){
  const url = 'user/register'
  return request.get(url,{username,password})
}
