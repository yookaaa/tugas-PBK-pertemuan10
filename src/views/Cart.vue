<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">
        <i class="fas fa-shopping-cart"></i> Keranjang Belanja
      </h1>
      
      <div class="cart-container">
        <div class="cart-items" v-if="cartStore.items.length > 0">
          <div class="cart-header">
            <div class="header-product">Produk</div>
            <div class="header-price">Harga</div>
            <div class="header-quantity">Jumlah</div>
            <div class="header-total">Subtotal</div>
            <div class="header-action">Aksi</div>
          </div>
          
          <div class="cart-item" v-for="item in cartStore.items" :key="item.id">
            <div class="item-product">
              <img :src="item.image" :alt="item.name" class="item-image" />
              <div class="item-details">
                <h3 class="item-name">{{ item.name }}</h3>
                <p class="item-category">{{ formatCategory(item.category) }}</p>
              </div>
            </div>
            <div class="item-price">Rp{{ calculateDiscount(item.price, item.discount).toLocaleString() }}</div>
            <div class="item-quantity">
              <button 
                class="quantity-btn" 
                @click="cartStore.decreaseQty(item)"
                :disabled="item.quantity <= 1"
              >
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity-value">{{ item.quantity }}</span>
              <button 
                class="quantity-btn" 
                @click="cartStore.increaseQty(item)"
                :disabled="item.quantity >= item.stock"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="item-total">Rp{{ (calculateDiscount(item.price, item.discount) * item.quantity).toLocaleString() }}</div>
            <div class="item-action">
              <button class="remove-btn" @click="cartStore.removeItem(item)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="empty-cart" v-else>
          <div class="empty-icon">
            <i class="fas fa-book-open"></i>
          </div>
          <h3>Keranjang belanja Anda kosong</h3>
          <p>Mulai belanja sekarang dan temukan buku favoritmu!</p>
          <router-link to="/products" class="shop-btn">
            <i class="fas fa-arrow-left"></i> Lanjut Belanja
          </router-link>
        </div>
        
        <div class="cart-summary" v-if="cartStore.items.length > 0">
          <div class="summary-card">
            <h3 class="summary-title">Ringkasan Belanja</h3>
            
            <div class="summary-row">
              <span>Subtotal</span>
              <span>Rp{{ cartStore.totalPrice.toLocaleString() }}</span>
            </div>
            
            <div class="summary-row">
              <span>Ongkos Kirim</span>
              <span>Gratis</span>
            </div>
            
            <div class="summary-row discount-row">
              <div class="discount-input">
                <input type="text" placeholder="Kode Diskon" v-model="discountCode" />
                <button class="apply-btn">Terapkan</button>
              </div>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-row total-row">
              <span>Total</span>
              <span class="total-price">Rp{{ cartStore.totalPrice.toLocaleString() }}</span>
            </div>
            
            <button class="checkout-btn" @click="handleCheckout">
              <i class="fas fa-credit-card"></i> Proses Checkout
            </button>
            
            <router-link to="/products" class="continue-shopping">
              <i class="fas fa-arrow-left"></i> Lanjut Belanja
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()
const discountCode = ref('')

const formatCategory = (category) => {
  const categories = {
    'novel': 'Novel',
    'biografi': 'Biografi',
    'fiksi-ilmiah': 'Fiksi Ilmiah'
  }
  return categories[category] || category
}

const calculateDiscount = (price, discount) => {
  return discount ? Math.round(price * (1 - discount/100)) : price;
};

const handleCheckout = () => {
  router.push('/checkout')
}
</script>

<style scoped>
.cart-page {
  padding: 40px 0;
  background-color: var(--color-background);
  min-height: calc(100vh - 160px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.cart-container {
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: flex-start;
}

/* --- Cart Items Card --- */
.cart-items {
  flex: 2;
  background: var(--color-surface);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  border: 1px solid var(--color-border);
  padding: 25px;
}

.cart-header {
  display: flex;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--color-border);
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
}

.header-product { flex: 3; }
.header-price, .header-quantity, .header-total { flex: 1; text-align: center; }
.header-action { flex: 0.5; text-align: center; }

.cart-item {
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-border);
}
.cart-item:last-child {
    border-bottom: none;
}

.item-product {
  flex: 3;
  display: flex;
  align-items: center;
  gap: 20px;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
  background-color: white; /* Jaga latar belakang gambar tetap putih */
  padding: 5px;
  border: 1px solid var(--color-border);
}

.item-name {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 5px 0;
  color: var(--color-text-primary);
}

.item-category {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.item-price, .item-total {
  flex: 1;
  text-align: center;
  font-weight: 500;
  color: var(--color-text-primary);
}

.item-quantity {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-primary);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.quantity-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.quantity-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity-value {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: var(--color-text-primary);
}

.item-action {
  flex: 0.5;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s;
}

.remove-btn:hover {
  color: var(--color-danger);
  transform: scale(1.1);
}

/* --- Empty Cart --- */
.empty-cart {
  flex: 1;
  background: var(--color-surface);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  padding: 60px 40px;
  text-align: center;
  width: 100%;
}

.empty-icon {
  font-size: 4rem;
  color: var(--color-primary);
  opacity: 0.5;
  margin-bottom: 25px;
}

.empty-cart h3 {
  color: var(--color-text-primary);
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.empty-cart p {
  color: var(--color-text-secondary);
  margin-bottom: 30px;
}

.shop-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--color-primary);
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-speed);
}

.shop-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(74, 105, 189, 0.3);
}

/* --- Summary Card --- */
.cart-summary {
  flex: 1;
  min-width: 300px;
}

.summary-card {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  border: 1px solid var(--color-border);
  padding: 25px;
  position: sticky;
  top: 115px; /* Sesuaikan dengan tinggi header + toolbar */
}

.summary-title {
  font-size: 1.5rem;
  color: var(--color-text-primary);
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--color-border);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: var(--color-text-secondary);
}

.discount-input {
  display: flex;
  width: 100%;
}

.discount-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-primary);
  border-radius: 8px 0 0 8px;
  outline: none;
}
.discount-input input:focus {
  border-color: var(--color-primary);
}

.apply-btn {
  padding: 0 15px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-weight: 500;
}

.summary-divider {
  height: 1px;
  background: var(--color-border);
  margin: 20px 0;
}

.total-row {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-text-primary);
}

.total-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.checkout-btn {
  width: 100%;
  background: var(--color-secondary);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 15px;
  transition: all var(--transition-speed);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(240, 147, 43, 0.3);
}

.continue-shopping {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  text-align: center;
  margin-top: 20px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color var(--transition-speed);
}

.continue-shopping:hover {
  color: var(--color-primary);
}

@media (max-width: 992px) {
  .cart-container {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .cart-header { display: none; }
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    position: relative;
    padding-bottom: 30px;
  }
  .item-product, .item-price, .item-quantity, .item-total {
    width: 100%;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .item-quantity { justify-content: flex-start; }
  .item-price::before, .item-total::before, .item-quantity::before {
    content: attr(data-label);
    font-weight: 600;
    color: var(--color-text-secondary);
  }
  .item-action { position: absolute; right: 0; top: 15px; }
}
</style>