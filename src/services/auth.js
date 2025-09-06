import { api } from './api'

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Login failed'
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed'
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user'
    }
  },

  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh')
      return response.data
    } catch (error) {
      throw error.response?.data?.message || 'Failed to refresh token'
    }
  }
}