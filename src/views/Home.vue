<template>
  <div class="home-container">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Jelajahi Dunia Melalui Kata</h1>
        <p class="hero-subtitle">Temukan buku favoritmu dari berbagai genre yang kami sediakan.</p>
        <router-link to="/products" class="hero-button">Jelajahi Koleksi Buku</router-link>
      </div>
      <div class="hero-image">
        <img src="/images/hero-books.png" alt="Books Collection" />
      </div>
    </section>

    <section class="features-section">
      <div class="feature-card">
        <i class="fas fa-shipping-fast"></i>
        <h3>Gratis Ongkir</h3>
        <p>Untuk pembelian di atas Rp250.000</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-book-reader"></i>
        <h3>Koleksi Lengkap</h3>
        <p>Ribuan judul buku original</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-headset"></i>
        <h3>Bantuan Pelanggan</h3>
        <p>Siap membantu Anda 24/7</p>
      </div>
    </section>

    <section class="featured-products">
      <div class="section-header">
        <h2>Buku Unggulan</h2>
        <router-link to="/products" class="view-all">Lihat Semua</router-link>
      </div>
      <div class="products-grid">
        <ProductCard 
          v-for="product in productStore.featuredProducts" 
          :key="product.id" 
          :product="product"
          @addToCart="handleAddToCart"
          @quickView="handleQuickView"
        />
      </div>
    </section>

    <section class="promo-banner">
      <div class="promo-content">
        <h2>Pesta Buku Akhir Tahun!</h2>
        <p>Diskon hingga 50% untuk buku-buku pilihan</p>
        <div class="countdown-timer">
          <div class="timer-box">
            <span>{{ days }}</span>
            <small>Hari</small>
          </div>
          <div class="timer-box">
            <span>{{ hours }}</span>
            <small>Jam</small>
          </div>
          <div class="timer-box">
            <span>{{ minutes }}</span>
            <small>Menit</small>
          </div>
          <div class="timer-box">
            <span>{{ seconds }}</span>
            <small>Detik</small>
          </div>
        </div>
        <router-link to="/products?discount=true" class="promo-button">Beli Sekarang</router-link>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue' // Tambahkan onUnmounted di sini
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import ProductCard from '@/components/ProductCard.vue'

// HAPUS IMPORT INI KARENA GAMBAR SUDAH ADA DI FOLDER PUBLIC
// import heroBooksImage from '../assets/images/hero-books.png'; 

const productStore = useProductStore()
const cartStore = useCartStore()

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

const handleAddToCart = (product) => {
  cartStore.addToCart(product)
}

const handleQuickView = (product) => {
  console.log('Quick view for:', product.name)
}

let countdownInterval; // Deklarasikan di luar onMounted agar bisa diakses clearInterval

const updateCountdown = () => {
  const now = new Date()
  // Mengatur hitung mundur ke 1 Januari tahun berikutnya
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0); 
  const diff = endOfYear - now
  
  if (diff < 0) {
    days.value = 0;
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
    clearInterval(countdownInterval); // Hentikan interval
    return;
  }
  
  days.value = Math.floor(diff / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((diff % (1000 * 60)) / 1000)
}

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.fetchProducts()
  }
  
  countdownInterval = setInterval(updateCountdown, 1000)
  updateCountdown() 
})

// Membersihkan interval saat komponen tidak lagi aktif untuk mencegah memory leak
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: var(--font-family);
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 40px;
  margin-bottom: 40px;
}

.hero-content {
  flex: 1;
  max-width: 50%;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 15px;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: 25px;
}

.hero-button {
  display: inline-block;
  background: var(--color-primary);
  color: white;
  padding: 12px 25px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(74, 105, 189, 0.3);
}

.hero-button:hover {
  background: #3b56a1;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 105, 189, 0.4);
}

.hero-image {
  flex: 1;
  max-width: 45%;
  text-align: center;
}

.hero-image img {
  width: 100%;
  max-width: 400px;
}

/* Features Section */
.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.feature-card {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  padding: 25px;
  text-align: center;
  border: 1px solid var(--color-border);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--box-shadow);
}

.feature-card i {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 15px;
}

.feature-card h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: var(--color-text-primary);
}

.feature-card p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

/* Featured Products */
.featured-products {
    margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h2 {
  font-size: 1.8rem;
  color: var(--color-text-primary);
}

.view-all {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.view-all:hover {
  color: #3b56a1;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

/* Promo Banner */
.promo-banner {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  border-radius: var(--border-radius);
  padding: 40px;
  margin-bottom: 40px;
  color: white;
  text-align: center;
}

.promo-content h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.promo-content p {
  font-size: 1.1rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

.countdown-timer {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
}

.timer-box {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 10px 15px;
  min-width: 70px;
}

.timer-box span {
  font-size: 1.8rem;
  font-weight: 700;
  display: block;
}

.timer-box small {
  font-size: 0.8rem;
  opacity: 0.8;
}

.promo-button {
  display: inline-block;
  background: white;
  color: var(--color-primary);
  padding: 12px 30px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.promo-button:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}


@media (max-width: 768px) {
  .hero-section {
    flex-direction: column-reverse;
    text-align: center;
    padding: 30px 20px;
  }
  
  .hero-content {
    max-width: 100%;
    margin-top: 30px;
  }
  
  .hero-image {
    max-width: 80%;
  }
  
  .features-section {
    grid-template-columns: 1fr;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>