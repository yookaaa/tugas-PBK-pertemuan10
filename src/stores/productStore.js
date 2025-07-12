import { defineStore } from 'pinia'
import axios from 'axios'
import { toast } from 'vue3-toastify'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    featuredProducts: [],
    // Mengubah kategori menjadi kategori buku
    categories: [
      { id: 'novel', name: 'Novel', image: '/images/novel-category.jpg' },
      { id: 'biografi', name: 'Biografi', image: '/images/biografi-category.jpg' },
      { id: 'fiksi-ilmiah', name: 'Fiksi Ilmiah', image: '/images/fiksi-ilmiah-category.jpg' }
    ],
    isLoading: false,
    error: null
  }),
  
  getters: {
    getProductsByCategory: (state) => (category) => {
      return state.products.filter(p => p.category === category)
    },
    getProductById: (state) => (id) => {
      return state.products.find(p => p.id === id)
    },
    getDiscountedProducts: (state) => {
      return state.products.filter(p => p.discount > 0)
    }
  },
  
  actions: {
    async fetchProducts() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get('http://localhost:3000/products')
        this.products = response.data
        
        // Ambil 4 produk secara acak sebagai featured
        this.featuredProducts = this.getRandomProducts(4)
      } catch (error) {
        this.error = 'Gagal memuat produk. Silakan coba lagi.'
        console.error('Failed to fetch products:', error)
        
        toast.error(this.error, {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        })
      } finally {
        this.isLoading = false
      }
    },
    
    getRandomProducts(count) {
      const shuffled = [...this.products].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count)
    },
    
    async addProduct(productData) {
      try {
        const response = await axios.post('http://localhost:3000/products', productData)
        this.products.push(response.data)
        
        toast.success('Produk berhasil ditambahkan!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        })
        
        return response.data
      } catch (error) {
        console.error('Failed to add product:', error)
        
        toast.error('Gagal menambahkan produk', {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        })
        
        throw error
      }
    },
    
    async updateProduct(id, productData) {
      try {
        const response = await axios.put(
          `http://localhost:3000/products/${id}`,
          productData
        )
        
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = response.data
        }
        
        toast.success('Produk berhasil diperbarui!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        })
        
        return response.data
      } catch (error) {
        console.error('Failed to update product:', error)
        
        toast.error('Gagal memperbarui produk', {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        })
        
        throw error
      }
    },
    
    async deleteProduct(id) {
      try {
        await axios.delete(`http://localhost:3000/products/${id}`)
        this.products = this.products.filter(p => p.id !== id)
        
        toast.success('Produk berhasil dihapus!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_RIGHT
        })
        
        return true
      } catch (error) {
        console.error('Failed to delete product:', error)
        
        toast.error('Gagal menghapus produk', {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT
        })
        
        throw error
      }
    }
  }
})