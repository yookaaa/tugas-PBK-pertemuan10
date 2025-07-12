<template>
  <div id="app-container">
    <header class="app-header" :class="{ 'header-scrolled': isScrolled }">
      <div class="container">
        <div class="header-content">
          <router-link to="/" class="logo">
            <img src="/images/book-logo.png" alt="TokoBuku Kita" class="logo-img" />
            <span class="logo-text">TokoBuku Kita</span>
          </router-link>

          <div class="search-bar">
            <input 
              type="text" 
              placeholder="Cari judul buku atau penulis..." 
              v-model="searchQuery"
              @keyup.enter="performSearch"
            />
            <button class="search-btn" @click="performSearch">
              <i class="fas fa-search"></i>
            </button>
          </div>

          <div class="header-actions">
            <router-link to="/account" class="account-link" v-if="authStore.isAuthenticated">
              <div class="user-avatar">
                {{ authStore.userInitial }}
              </div>
              <span class="username">{{ authStore.currentUser.username }}</span>
            </router-link>

            <router-link to="/login" class="auth-link" v-else>
              <i class="fas fa-user"></i>
              <span>Login</span>
            </router-link>

            <router-link to="/cart" class="cart-link">
              <i class="fas fa-shopping-cart"></i>
              <span class="cart-count" v-if="cartStore.cartCount > 0">
                {{ cartStore.cartCount }}
              </span>
            </router-link>
          </div>
        </div>

        <nav class="main-nav">
          <router-link to="/products" class="nav-link">Semua Buku</router-link>
          <router-link 
            v-for="category in productStore.categories" 
            :key="category.id"
            :to="`/products?category=${category.id}`"
            class="nav-link"
          >
            {{ category.name }}
          </router-link>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="app-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <h3 class="footer-title">TokoBuku Kita</h3>
            <p class="footer-about">
              Toko buku online terpercaya dengan koleksi terlengkap dan harga terbaik.
            </p>
            <div class="social-links">
              <a href="#"><i class="fab fa-instagram"></i></a>
              <a href="#"><i class="fab fa-facebook"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-whatsapp"></i></a>
            </div>
          </div>

          <div class="footer-col">
            <h3 class="footer-title">Kategori</h3>
            <ul class="footer-links">
              <li v-for="category in productStore.categories" :key="category.id">
                <router-link :to="`/products?category=${category.id}`">
                  {{ category.name }}
                </router-link>
              </li>
            </ul>
          </div>

          <div class="footer-col">
            <h3 class="footer-title">Bantuan</h3>
            <ul class="footer-links">
              <li><router-link to="/faq">FAQ</router-link></li>
              <li><router-link to="/shipping">Pengiriman</router-link></li>
              <li><router-link to="/returns">Retur</router-link></li>
              <li><router-link to="/contact">Kontak Kami</router-link></li>
            </ul>
          </div>

          <div class="footer-col">
            <h3 class="footer-title">Newsletter</h3>
            <p>Dapatkan promo dan penawaran spesial</p>
            <form class="newsletter-form" @submit.prevent>
              <input type="email" placeholder="Email Anda" />
              <button type="submit" class="subscribe-btn">Berlangganan</button>
            </form>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ new Date().getFullYear() }} TokoBuku Kita. All rights reserved.</p>
          <div class="payment-methods">
            <i class="fab fa-cc-visa"></i>
            <i class="fab fa-cc-mastercard"></i>
            <i class="fab fa-cc-paypal"></i>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useProductStore } from '@/stores/productStore'

const authStore = useAuthStore()
const cartStore = useCartStore()
const productStore = useProductStore()
const router = useRouter()

const searchQuery = ref('')
const isScrolled = ref(false)

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/products', query: { search: searchQuery.value.trim() } })
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.fetchProducts()
  }
  cartStore.loadFromLocalStorage()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>

/* src/App.vue -> style scoped */

#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

/* Header Styles */
.app-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all var(--transition-speed) ease;
  padding: 10px 0;
}

.app-header.header-scrolled {
    box-shadow: var(--box-shadow);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 12px;
}

.logo-img {
  height: 45px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.search-bar {
  flex: 1;
  max-width: 500px;
  margin: 0 30px;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 12px 20px 12px 45px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  border-radius: 50px;
  font-size: 0.9rem;
  transition: all var(--transition-speed);
}

.search-bar input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 105, 189, 0.3);
}

.search-btn {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.account-link, .auth-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: 500;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--border-radius);
  transition: all var(--transition-speed);
}

.account-link:hover, .auth-link:hover {
  color: var(--color-text-primary);
  background-color: rgba(0, 0, 0, 0.05);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-link {
  position: relative;
  font-size: 1.3rem;
  color: var(--color-text-secondary);
  padding: 10px;
  transition: color var(--transition-speed);
}
.cart-link:hover {
  color: var(--color-primary);
}

.cart-count {
  position: absolute;
  top: 2px;
  right: 2px;
  background: var(--color-danger);
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-surface);
}

.main-nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 10px;
  border-top: 1px solid var(--color-border);
  margin-top: 10px;
}

.nav-link {
  padding: 10px 15px;
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: all var(--transition-speed);
  position: relative;
  border-radius: 8px;
}

.nav-link:hover {
  color: var(--color-text-primary);
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-link.router-link-exact-active {
  color: var(--color-primary);
  font-weight: 600;
}

.app-main {
  flex: 1;
  padding: 40px 0;
}

/* Footer Styles */
.app-footer {
  background: var(--color-surface);
  color: var(--color-text-secondary);
  padding: 50px 0 20px;
  border-top: 1px solid var(--color-border);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.footer-col {
    padding: 0 15px;
}

.footer-title {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: var(--color-text-primary);
  position: relative;
  padding-bottom: 10px;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--color-primary);
}

.footer-about {
  line-height: 1.7;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.social-links a {
  color: var(--color-text-secondary);
  font-size: 1.3rem;
  transition: color var(--transition-speed);
}
.social-links a:hover {
  color: var(--color-primary);
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-speed);
}
.footer-links a:hover {
  color: var(--color-text-primary);
}

.newsletter-form {
  display: flex;
  margin-top: 15px;
}

.newsletter-form input {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  border-radius: 8px 0 0 8px;
  outline: none;
  color: var(--color-text-primary);
}

.subscribe-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0 15px;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-weight: 500;
}

.footer-bottom {
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.payment-methods {
  display: flex;
  gap: 15px;
  font-size: 1.8rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>