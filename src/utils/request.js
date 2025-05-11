import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

// 创建 axios 实例
const request = axios.create({
    baseURL: '/api/auth',
    timeout: 60000
})

// 请求拦截器
// request.interceptors.request.use(
//     (config) => {
//         const loginUser = JSON.parse(localStorage.getItem('loginUser'))
//         if (loginUser?.token) {
//             config.headers['Authorization'] = `Bearer ${loginUser.token}`
//         }
//         return config
//     },
//     (error) => Promise.reject(error)
// )

// request.interceptors.request.use(
//     (config) => {
//         let loginUser = JSON.parse(localStorage.getItem('loginUser'))
//
//         if (loginUser) {
//             config.headers.Authorization = `Bearer ${loginUser.token}`
//         }
//
//         // 确保发送 JSON 格式
//         config.headers['Content-Type'] = 'application/json'
//
//         return config
//     },
//     (error) => {
//         return Promise.reject(error)
//     }
// )

request.interceptors.request.use(
    (config) => {

        const userStr = localStorage.getItem('loginUser');
        console.log("你在干什么啊",userStr)
        if (userStr!=="undefined" && userStr) {
            const loginUser = JSON.parse(userStr);
            config.headers.Authorization = `Bearer ${loginUser.token}`;
        }


        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => Promise.reject(error)
);


// 响应拦截器
request.interceptors.response.use(

    (response) => {
        console.log(response);  // 打印响应
        return response.data;
    },
    (error) => {
        if (error.response?.status === 401) {
            ElMessage.error('登录失效，请重新登录')
            localStorage.removeItem('loginUser')
            router.push('/login')
        }
        return Promise.reject(error)
    }
)

export default request
