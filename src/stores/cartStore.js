import { defineStore } from 'pinia';
import { toast } from 'vue3-toastify';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    cartCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.price * (1 - (item.discount || 0) / 100)) * item.quantity, 0),
  },
  actions: {
    loadFromLocalStorage() {
        const cartData = localStorage.getItem('cart');
        try {
            this.items = cartData ? JSON.parse(cartData) : [];
        } catch (e) {
            this.items = [];
        }
    },
    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    addToCart(product, quantity = 1) {
      const existing = this.items.find((p) => p.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({ ...product, quantity });
      }
      this.saveToLocalStorage();
      toast.success(`"${product.name}" ditambahkan ke keranjang!`);
    },
    increaseQty(item) {
      const target = this.items.find((p) => p.id === item.id);
      if (target && target.quantity < item.stock) {
        target.quantity++;
        this.saveToLocalStorage();
      }
    },
    decreaseQty(item) {
      const target = this.items.find((p) => p.id === item.id);
      if (target && target.quantity > 1) {
        target.quantity--;
        this.saveToLocalStorage();
      }
    },
    removeItem(item) {
      this.items = this.items.filter((p) => p.id !== item.id);
      this.saveToLocalStorage();
      toast.info(`"${item.name}" dihapus dari keranjang.`);
    },
    clearCart() {
        this.items = [];
        this.saveToLocalStorage();
    }
  },
});