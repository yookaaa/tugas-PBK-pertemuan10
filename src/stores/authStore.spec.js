import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './authStore'
import axios from 'axios'
import { toast } from 'vue3-toastify'

// Mock libraries
vi.mock('axios')
vi.mock('vue3-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should initialize with null user if no localStorage', () => {
    const authStore = useAuthStore()
    expect(authStore.user).toBe(null)
    expect(authStore.isAuthenticated).toBe(false)
    expect(authStore.userInitial).toBe('U')
  })

  it('should initialize with user from localStorage', () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' }
    localStorage.setItem('user', JSON.stringify(mockUser))
    
    const authStore = useAuthStore()
    expect(authStore.user).toEqual(mockUser)
    expect(authStore.isAuthenticated).toBe(true)
    expect(authStore.userInitial).toBe('T')
  })

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const authStore = useAuthStore()
      const mockUser = { id: 1, username: 'test', password: 'password' }
      const mockResponse = { data: [mockUser] }
      
      axios.get.mockResolvedValue(mockResponse)

      const credentials = { username: 'test', password: 'password' }
      const result = await authStore.login(credentials)

      expect(result).toBe(true)
      expect(authStore.user).toEqual(mockUser)
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser))
      expect(toast.success).toHaveBeenCalledWith('Login berhasil!', {
        autoClose: 2000,
        position: 'top-right'
      })
    })

    it('should fail login with incorrect credentials', async () => {
      const authStore = useAuthStore()
      const mockResponse = { data: [] }
      
      axios.get.mockResolvedValue(mockResponse)

      const credentials = { username: 'wrong', password: 'user' }
      const result = await authStore.login(credentials)

      expect(result).toBe(false)
      expect(authStore.user).toBe(null)
      expect(localStorage.getItem('user')).toBe(null)
      expect(toast.error).toHaveBeenCalledWith('Username atau password salah', {
        autoClose: 3000,
        position: 'top-right'
      })
    })

    it('should handle login error', async () => {
      const authStore = useAuthStore()
      const error = new Error('Network error')
      
      axios.get.mockRejectedValue(error)

      const credentials = { username: 'test', password: 'password' }
      const result = await authStore.login(credentials)

      expect(result).toBe(false)
      expect(authStore.error).toBe('Network error')
      expect(toast.error).toHaveBeenCalledWith('Network error', {
        autoClose: 3000,
        position: 'top-right'
      })
    })
  })

  describe('register', () => {
    it('should register successfully with new username', async () => {
      const authStore = useAuthStore()
      const newUser = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password'
      }
      
      // Mock username check - no existing user
      axios.get.mockResolvedValueOnce({ data: [] })
      // Mock registration
      axios.post.mockResolvedValue({ data: { ...newUser, id: 2 } })

      const result = await authStore.register(newUser)

      expect(result).toBe(true)
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/users', {
        ...newUser,
        createdAt: expect.any(String)
      })
      expect(toast.success).toHaveBeenCalledWith(
        'Registrasi berhasil! Silakan login.', 
        expect.any(Object)
      )
    })

    it('should fail registration with existing username', async () => {
      const authStore = useAuthStore()
      const newUser = {
        username: 'existing',
        email: 'exist@example.com',
        password: 'password'
      }
      
      // Mock username check - existing user found
      axios.get.mockResolvedValue({ data: [{ id: 1, username: 'existing' }] })

      const result = await authStore.register(newUser)

      expect(result).toBe(false)
      expect(axios.post).not.toHaveBeenCalled()
      expect(toast.error).toHaveBeenCalledWith(
        'Username sudah digunakan', 
        expect.any(Object)
      )
    })

    it('should handle registration error', async () => {
      const authStore = useAuthStore()
      const newUser = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password'
      }
      const error = new Error('Registration failed')
      
      // Mock username check - no existing user
      axios.get.mockResolvedValueOnce({ data: [] })
      // Mock registration error
      axios.post.mockRejectedValue(error)

      const result = await authStore.register(newUser)

      expect(result).toBe(false)
      expect(authStore.error).toBe('Registration failed')
      expect(toast.error).toHaveBeenCalledWith(
        'Registration failed', 
        expect.any(Object)
      )
    })
  })

  describe('logout', () => {
    it('should clear user state and localStorage', () => {
      const authStore = useAuthStore()
      
      // Simulate logged in user
      authStore.user = { id: 1, username: 'test' }
      localStorage.setItem('user', JSON.stringify({ id: 1, username: 'test' }))

      authStore.logout()

      expect(authStore.user).toBe(null)
      expect(localStorage.getItem('user')).toBe(null)
      expect(toast.info).toHaveBeenCalledWith(
        'Anda telah logout', 
        expect.any(Object)
      )
    })
  })

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const authStore = useAuthStore()
      const initialUser = { id: 1, username: 'test', email: 'old@example.com' }
      const updatedData = { email: 'new@example.com', phone: '123456789' }
      const updatedUser = { ...initialUser, ...updatedData }
      
      // Set initial user
      authStore.user = initialUser
      localStorage.setItem('user', JSON.stringify(initialUser))
      
      // Mock API response
      axios.put.mockResolvedValue({ data: updatedUser })

      const result = await authStore.updateProfile(updatedData)

      expect(result).toBe(true)
      expect(authStore.user).toEqual(updatedUser)
      expect(localStorage.getItem('user')).toBe(JSON.stringify(updatedUser))
      expect(axios.put).toHaveBeenCalledWith(
        `http://localhost:3000/users/${initialUser.id}`,
        updatedUser
      )
      expect(toast.success).toHaveBeenCalledWith(
        'Profil berhasil diperbarui!', 
        expect.any(Object)
      )
    })

    it('should handle profile update error', async () => {
      const authStore = useAuthStore()
      const initialUser = { id: 1, username: 'test' }
      const error = new Error('Update failed')
      
      // Set initial user
      authStore.user = initialUser
      
      // Mock API error
      axios.put.mockRejectedValue(error)

      const result = await authStore.updateProfile({ email: 'new@example.com' })

      expect(result).toBe(false)
      expect(authStore.error).toBe('Update failed')
      expect(toast.error).toHaveBeenCalledWith(
        'Update failed', 
        expect.any(Object)
      )
    })

    it('should return false if no user is logged in', async () => {
      const authStore = useAuthStore()
      
      const result = await authStore.updateProfile({ email: 'new@example.com' })

      expect(result).toBe(false)
      expect(axios.put).not.toHaveBeenCalled()
    })
  })
})