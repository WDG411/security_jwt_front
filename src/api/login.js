import request from '@/utils/request'

//登录
export const loginApi = (data) => request.post('/signin', data)

//注册
export const registerApi = (data) => request.post('/signup', data)