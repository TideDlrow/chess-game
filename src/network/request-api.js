import request from '@/network/request-method'
import { getToken } from '@/util/content'

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

/**
 * 获取最佳的下一步
 * @param {string} FENString 局面表示的FEN串
 * @param {boolean} camp 要行动的阵营
 * @return
 */
export function bestNext(FENString,camp){
  const url = 'PVE/bestNext'
  const token = getToken()
  return request.get(url,{FENString,camp},{token})
}
