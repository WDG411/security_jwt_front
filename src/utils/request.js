import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

// 创建 axios 实例
const request = axios.create({
    baseURL: '/api/auth',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器：自动带上 Bearer token
request.interceptors.request.use(
    config => {
        const userStr = localStorage.getItem('loginUser')
        if (userStr && userStr !== 'undefined') {
            try {
                const loginUser = JSON.parse(userStr)
                if (loginUser.token) {
                    config.headers.Authorization = `Bearer ${loginUser.token}`
                }
            } catch (e) {
                console.warn('解析 loginUser 失败：', e)
            }
        }
        return config
    },
    error => Promise.reject(error)
)

// 响应拦截器：返回 data，错误时抛出后端返回的 data
request.interceptors.response.use(
    response => {
        // 2xx 时直接返回 data
        return response.data
    },
    error => {
        const res = error.response
        // 401 单独处理：提示、清除登录信息并跳转登录页
        if (res?.status === 401) {
            ElMessage.error('登录失效，请重新登录')
            localStorage.removeItem('loginUser')
            router.push('/login')
            // 如果也想让调用方拿到后端的 message：
            return Promise.reject(res.data)
        }
        // 其它错误，把后端返回的 data 抛给调用方
        return Promise.reject(res?.data ?? error)
    }
)

export default request
