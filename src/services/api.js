import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// Response interceptor
api.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response && error.response.status === 401) {
    const authStore = authStore()
    authStore.logout()
  }
  return Promise.reject(error)
})

export { api }