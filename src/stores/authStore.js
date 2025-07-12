import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import { useCartStore } from './cartStore'
import { useProductStore } from './productStore'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    userInitial: (state) => state.user?.username?.charAt(0).toUpperCase() || 'U'
  },
  
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        // Simulasi delay untuk UX yang lebih baik
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const response = await axios.get(
          `http://localhost:3000/users?username=${credentials.username}&password=${credentials.password}`
        )
        
        if (response.data.length === 0) {
          throw new Error('Username atau password salah')
        }
        
        this.user = response.data[0]
        localStorage.setItem('user', JSON.stringify(this.user))
        
        // Sync cart from localStorage to store
        const cartStore = useCartStore()
        cartStore.loadFromLocalStorage()
        
        toast.success('Login berhasil!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        })
        
        router.push('/account')
        return true
      } catch (error) {
        this.error = error.message || 'Login gagal. Silakan coba lagi.'
        
        toast.error(this.error, {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        })
        
        return false
      } finally {
        this.loading = false
      }
    },
    
    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        // Cek ketersediaan username
        const checkResponse = await axios.get(
          `http://localhost:3000/users?username=${userData.username}`
        )
        
        if (checkResponse.data.length > 0) {
          throw new Error('Username sudah digunakan')
        }
        
        // Tambahkan created date
        const newUser = {
          ...userData,
          createdAt: new Date().toISOString()
        }
        
        const response = await axios.post('http://localhost:3000/users', newUser)
        
        toast.success('Registrasi berhasil! Silakan login.', {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        })
        
        router.push('/login')
        return true
      } catch (error) {
        this.error = error.message || 'Registrasi gagal. Silakan coba lagi.'
        
        toast.error(this.error, {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        })
        
        return false
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.user = null
      localStorage.removeItem('user')
      
      // Clear cart store
      const cartStore = useCartStore()
      cartStore.clearCart()
      
      toast.info('Anda telah logout', {
        autoClose: 2000,
        position: toast.POSITION.TOP_RIGHT
      })
      
      router.push('/login')
    },
    
    async updateProfile(updatedData) {
      if (!this.user) return false
      
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.put(
          `http://localhost:3000/users/${this.user.id}`,
          { ...this.user, ...updatedData }
        )
        
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(this.user))
        
        toast.success('Profil berhasil diperbarui!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        })
        
        return true
      } catch (error) {
        this.error = error.message || 'Gagal memperbarui profil'
        
        toast.error(this.error, {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        })
        
        return false
      } finally {
        this.loading = false
      }
    }
  }
})