import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import { API } from '../../public/config'
// 创建一个新的axios实例
const service = axios.create({
  // baseURL: 'http://192.168.2.250:8080/',
  baseURL: API.url
  // withCredentials: true,
})
// 处理token的统一注入问题
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (response.config.responseType === 'arraybuffer') {
      return response
    }
    if (res.status === 2005) {
      this.$router.push('/login')
    }
    if (res.code !== 200 && res.code !== 61024 && res.code !== 60008 && res.code !== 61025) {
      Message({
        // message: res.data || res.msg,
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.msg))
      // return Promise.reject(new Error(res.data || res.msg))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
