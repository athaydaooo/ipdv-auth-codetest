// services/api.js
import store from '@/store/auth'
import axios from 'axios'

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const api = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
})

// Adiciona o token em todas as requisições
api.interceptors.request.use(config => {
  const token = store.state.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor para lidar com 401 e refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      store.state.refreshToken
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = 'Bearer ' + token
            return axios(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      isRefreshing = true

      try {
        const newToken = await store.dispatch('refreshToken')
        processQueue(null, newToken)
        originalRequest.headers.Authorization = 'Bearer ' + newToken
        return axios(originalRequest)
      } catch (err) {
        processQueue(err, null)
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
