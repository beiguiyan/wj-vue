import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
    baseURL: './',
    timeout: 5000
})

request.interceptors.request.use(config => {
    let headers = {'Content-Type': 'application/json;charset=utf-8'}
    config.headers = {...headers, ...config.headers}
    return config
},
 error => {
     ElMessage({message: error, type: 'error'})
})

request.interceptors.response.use(response => {
    let res = response.data

    if (res.code == 200) {
        return res.data
    } else {
        ElMessage({message: res.msg, type: 'error'})
        return new Promise(() => {})
    }
},
    error => {
     ElMessage({message: error, type: 'error'})
     return new Promise(() => {})
    }
 )

export default request
