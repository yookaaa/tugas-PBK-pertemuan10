import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from './cartStore'

// Mock toast for testing environment
vi.mock('vue3-toastify', () => ({
    toast: {
      success: vi.fn(),
      info: vi.fn()
    }
}));

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks(); // Membersihkan semua mock sebelum setiap tes
  })

  it('should initialize with empty items if no localStorage', () => {
    const cartStore = useCartStore()
    cartStore.loadFromLocalStorage() // Panggil secara manual untuk konsistensi
    expect(cartStore.items).toEqual([])
    expect(cartStore.cartCount).toBe(0)
    expect(cartStore.totalPrice).toBe(0)
  })

  it('should initialize with items from localStorage', () => {
    const mockItems = [
      { id: 1, name: 'Product 1', price: 100000, quantity: 2, stock: 10 },
      { id: 2, name: 'Product 2', price: 150000, quantity: 1, stock: 5, discount: 10 } // 135000
    ]
    localStorage.setItem('cart', JSON.stringify(mockItems))
    
    const cartStore = useCartStore()
    cartStore.loadFromLocalStorage()

    expect(cartStore.items).toEqual(mockItems)
    expect(cartStore.cartCount).toBe(3)
    // 2*100000 + 1*(150000 * 0.9) = 200000 + 135000 = 335000
    expect(cartStore.totalPrice).toBe(335000) 
  })

  describe('addToCart', () => {
    it('should add new product to cart', () => {
      const cartStore = useCartStore()
      cartStore.loadFromLocalStorage()
      const product = { id: 1, name: 'New Product', price: 200000, stock: 5 }
      
      cartStore.addToCart(product)
      
      expect(cartStore.items).toEqual([{ ...product, quantity: 1 }])
      expect(localStorage.getItem('cart')).toBe(JSON.stringify(cartStore.items))
      expect(cartStore.cartCount).toBe(1)
      expect(cartStore.totalPrice).toBe(200000)
    })

    it('should increment quantity if product already in cart', () => {
      const cartStore = useCartStore()
      const product = { id: 1, name: 'Existing Product', price: 100000, stock: 5 }
      cartStore.items = [{ ...product, quantity: 1 }]; // Setup state awal
      
      cartStore.addToCart(product)
      
      expect(cartStore.items).toEqual([{ ...product, quantity: 2 }])
      expect(localStorage.getItem('cart')).toBe(JSON.stringify(cartStore.items))
      expect(cartStore.cartCount).toBe(2)
      expect(cartStore.totalPrice).toBe(200000)
    })
  })

  describe('increaseQty', () => {
    it('should increase quantity of existing item', () => {
      const cartStore = useCartStore()
      const item = { id: 1, name: 'Product', price: 100000, quantity: 1, stock: 3 }
      cartStore.items = [item]
      
      cartStore.increaseQty(item)
      
      expect(cartStore.items[0].quantity).toBe(2)
      expect(localStorage.getItem('cart')).toBe(JSON.stringify(cartStore.items))
      expect(cartStore.cartCount).toBe(2)
      expect(cartStore.totalPrice).toBe(200000)
    })

    it('should not increase quantity if stock is reached', () => {
        const cartStore = useCartStore()
        const item = { id: 1, name: 'Product', price: 100000, quantity: 3, stock: 3 }
        cartStore.items = [item]
        
        cartStore.increaseQty(item)
        
        expect(cartStore.items[0].quantity).toBe(3) // Tetap 3
    });
  })

  describe('decreaseQty', () => {
    it('should decrease quantity of existing item', () => {
      const cartStore = useCartStore()
      const item = { id: 1, name: 'Product', price: 100000, quantity: 2, stock: 3 }
      cartStore.items = [item]
      
      cartStore.decreaseQty(item)
      
      expect(cartStore.items[0].quantity).toBe(1)
      expect(localStorage.getItem('cart')).toBe(JSON.stringify(cartStore.items))
      expect(cartStore.cartCount).toBe(1)
      expect(cartStore.totalPrice).toBe(100000)
    })

    it('should not decrease below 1', () => {
      const cartStore = useCartStore()
      const item = { id: 1, name: 'Product', price: 100000, quantity: 1, stock: 3 }
      cartStore.items = [item]
      
      cartStore.decreaseQty(item)
      
      expect(cartStore.items[0].quantity).toBe(1)
      expect(localStorage.getItem('cart')).toBe(JSON.stringify(cartStore.items))
    })
  })

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const cartStore = useCartStore()
      const initialItems = [
        { id: 1, name: 'Product 1', price: 100000, quantity: 1, stock: 2 },
        { id: 2, name: 'Product 2', price: 150000, quantity: 2, stock: 5 }
      ]
      cartStore.items = initialItems
      
      cartStore.removeItem(initialItems[0])
      
      expect(cartStore.items).toEqual([initialItems[1]])
      expect(localStorage.getItem('cart')).toBe(JSON.stringify([initialItems[1]]))
      expect(cartStore.cartCount).toBe(2)
      expect(cartStore.totalPrice).toBe(300000)
    })
  })

  describe('clearCart', () => {
    it('should empty the cart', () => {
      const cartStore = useCartStore()
      cartStore.items = [
        { id: 1, name: 'Product 1', price: 100000, quantity: 1, stock: 2 },
      ]
      
      cartStore.clearCart()
      
      expect(cartStore.items).toEqual([])
      expect(localStorage.getItem('cart')).toBe(JSON.stringify([]))
      expect(cartStore.cartCount).toBe(0)
      expect(cartStore.totalPrice).toBe(0)
    })
  })

  describe('loadFromLocalStorage', () => {
    it('should load items from localStorage', () => {
      const mockItems = [
        { id: 1, name: 'Product 1', price: 100000, quantity: 2, stock: 10 },
      ]
      localStorage.setItem('cart', JSON.stringify(mockItems))
      
      const cartStore = useCartStore()
      cartStore.items = [] // Simulasikan store kosong dulu
      cartStore.loadFromLocalStorage()
      
      expect(cartStore.items).toEqual(mockItems)
    })

    it('should handle invalid localStorage data', () => {
      localStorage.setItem('cart', 'invalid json')
      
      const cartStore = useCartStore()
      cartStore.loadFromLocalStorage()
      
      expect(cartStore.items).toEqual([])
    })
  })
})