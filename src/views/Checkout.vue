<template>
  <div class="checkout-page">
    <div class="container">
      <div class="checkout-header">
        <h1><i class="fas fa-cash-register"></i> Checkout</h1>
        <div class="checkout-steps">
          <div class="step" :class="{ active: currentStep >= 1 }">
            <div class="step-number">1</div>
            <div class="step-title">Informasi</div>
          </div>
          <div class="step" :class="{ active: currentStep >= 2 }">
            <div class="step-number">2</div>
            <div class="step-title">Pengiriman</div>
          </div>
          <div class="step" :class="{ active: currentStep >= 3 }">
            <div class="step-number">3</div>
            <div class="step-title">Pembayaran</div>
          </div>
          <div class="step" :class="{ active: currentStep >= 4 }">
            <div class="step-number">4</div>
            <div class="step-title">Selesai</div>
          </div>
        </div>
      </div>
      
      <div class="checkout-content">
        <div class="checkout-step" v-if="currentStep === 1">
          <h2>Informasi Pelanggan</h2>
          <form @submit.prevent="goToStep(2)">
            <div class="form-group">
              <label>Nama Lengkap</label>
              <input type="text" v-model="customerInfo.fullName" required />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="customerInfo.email" required />
              </div>
              <div class="form-group">
                <label>No. Telepon</label>
                <input type="tel" v-model="customerInfo.phone" required />
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn-next">
                Lanjut ke Pengiriman <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </form>
        </div>
        
        <div class="checkout-step" v-if="currentStep === 2">
          <h2>Informasi Pengiriman</h2>
          <form @submit.prevent="goToStep(3)">
            <div class="form-group">
              <label>Alamat Lengkap</label>
              <textarea v-model="shippingInfo.address" rows="3" required></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Provinsi</label>
                <select v-model="shippingInfo.province" required>
                  <option value="">Pilih Provinsi</option>
                  <option v-for="prov in provinces" :key="prov.id" :value="prov.name">
                    {{ prov.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Kota/Kabupaten</label>
                <select v-model="shippingInfo.city" required>
                  <option value="">Pilih Kota</option>
                  <option v-for="city in filteredCities" :key="city.id" :value="city.name">
                    {{ city.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Kecamatan</label>
                <input type="text" v-model="shippingInfo.district" required />
              </div>
              <div class="form-group">
                <label>Kode Pos</label>
                <input type="text" v-model="shippingInfo.postalCode" required />
              </div>
            </div>
            
            <div class="form-group">
              <label>Kurir</label>
              <div class="shipping-options">
                <label 
                  v-for="option in shippingOptions" 
                  :key="option.id"
                  :class="{ active: shippingInfo.shippingMethod === option.id }"
                >
                  <input 
                    type="radio" 
                    v-model="shippingInfo.shippingMethod" 
                    :value="option.id" 
                    required
                  />
                  <div class="option-card">
                    <div class="option-icon">
                      <i :class="option.icon"></i>
                    </div>
                    <div class="option-details">
                      <div class="option-name">{{ option.name }}</div>
                      <div class="option-price">Rp{{ option.price.toLocaleString() }}</div>
                      <div class="option-estimate">{{ option.estimate }}</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-prev" @click="goToStep(1)">
                <i class="fas fa-arrow-left"></i> Kembali
              </button>
              <button type="submit" class="btn-next">
                Lanjut ke Pembayaran <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </form>
        </div>
        
        <div class="checkout-step" v-if="currentStep === 3">
          <h2>Metode Pembayaran</h2>
          <form @submit.prevent="submitOrder">
            <div class="form-group">
              <label>Pilih Metode Pembayaran</label>
              <div class="payment-options">
                <label 
                  v-for="method in paymentMethods" 
                  :key="method.id"
                  :class="{ active: paymentInfo.method === method.id }"
                >
                  <input 
                    type="radio" 
                    v-model="paymentInfo.method" 
                    :value="method.id" 
                    required
                  />
                  <div class="payment-card">
                    <img :src="method.logo" :alt="method.name" class="payment-logo" />
                    <div class="payment-name">{{ method.name }}</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div class="form-group" v-if="paymentInfo.method === 'bank_transfer'">
              <label>Pilih Bank</label>
              <div class="bank-options">
                <label 
                  v-for="bank in banks" 
                  :key="bank.code"
                  :class="{ active: paymentInfo.bank === bank.code }"
                >
                  <input 
                    type="radio" 
                    v-model="paymentInfo.bank" 
                    :value="bank.code" 
                    :required="paymentInfo.method === 'bank_transfer'"
                  />
                  <div class="bank-card">
                    <img :src="bank.logo" :alt="bank.name" class="bank-logo" />
                    <div class="bank-name">{{ bank.name }}</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div class="order-summary">
              <h3>Ringkasan Pesanan</h3>
              <div class="summary-row">
                <span>Subtotal</span>
                <span>Rp{{ cartStore.totalPrice.toLocaleString() }}</span>
              </div>
              <div class="summary-row">
                <span>Ongkos Kirim</span>
                <span>Rp{{ shippingPrice.toLocaleString() }}</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-row total">
                <span>Total Pembayaran</span>
                <span>Rp{{ totalPayment.toLocaleString() }}</span>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-prev" @click="goToStep(2)">
                <i class="fas fa-arrow-left"></i> Kembali
              </button>
              <button type="submit" class="btn-pay">
                <i class="fas fa-lock"></i> Bayar Sekarang
              </button>
            </div>
          </form>
        </div>
        
        <div class="checkout-step order-complete" v-if="currentStep === 4">
          <div class="complete-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h2>Pesanan Berhasil!</h2>
          <p class="order-number">Nomor Pesanan: #{{ orderNumber }}</p>
          <p>Terima kasih telah berbelanja di TokoBuku Kita. Kami telah mengirimkan detail pesanan ke email Anda.</p>
          
          <div class="order-details">
            <div class="detail-row">
              <span>Tanggal Pesanan</span>
              <span>{{ new Date().toLocaleDateString() }}</span>
            </div>
            <div class="detail-row">
              <span>Metode Pembayaran</span>
              <span>{{ paymentMethodName }}</span>
            </div>
            <div class="detail-row">
              <span>Total Pembayaran</span>
              <span>Rp{{ totalPayment.toLocaleString() }}</span>
            </div>
            <div class="detail-row">
              <span>Alamat Pengiriman</span>
              <span>{{ shippingAddress }}</span>
            </div>
          </div>
          
          <div class="action-buttons">
            <router-link to="/orders" class="btn-view-orders">
              <i class="fas fa-clipboard-list"></i> Lihat Pesanan
            </router-link>
            <router-link to="/products" class="btn-continue-shopping">
              <i class="fas fa-shopping-bag"></i> Lanjut Belanja
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/authStore'

const cartStore = useCartStore()
const router = useRouter()

const currentStep = ref(1)
const orderNumber = ref('BK' + Math.floor(Math.random() * 1000000))

// Customer Information
const customerInfo = ref({
  fullName: '',
  email: '',
  phone: ''
})

// Shipping Information
const shippingInfo = ref({
  address: '',
  province: '',
  city: '',
  district: '',
  postalCode: '',
  shippingMethod: ''
})

// Payment Information
const paymentInfo = ref({
  method: '',
  bank: ''
})

// Sample data for provinces and cities
const provinces = ref([
  { id: 1, name: 'Jawa Barat' },
  { id: 2, name: 'Jawa Tengah' },
  { id: 3, name: 'Jawa Timur' },
  { id: 4, name: 'DKI Jakarta' }
])

const cities = ref([
  { id: 1, provinceId: 1, name: 'Bandung' },
  { id: 2, provinceId: 1, name: 'Bogor' },
  { id: 3, provinceId: 1, name: 'Bekasi' },
  { id: 4, provinceId: 2, name: 'Semarang' },
  { id: 5, provinceId: 2, name: 'Solo' },
  { id: 6, provinceId: 3, name: 'Surabaya' },
  { id: 7, provinceId: 3, name: 'Malang' },
  { id: 8, provinceId: 4, name: 'Jakarta Pusat' },
  { id: 9, provinceId: 4, name: 'Jakarta Selatan' }
])

const shippingOptions = ref([
  { id: 'jne', name: 'JNE', price: 15000, estimate: '2-3 hari', icon: 'fas fa-truck' },
  { id: 'tiki', name: 'TIKI', price: 20000, estimate: '1-2 hari', icon: 'fas fa-shipping-fast' },
  { id: 'pos', name: 'POS Indonesia', price: 10000, estimate: '3-5 hari', icon: 'fas fa-box' }
])

const paymentMethods = ref([
  { id: 'bank_transfer', name: 'Transfer Bank', logo: '/images/bank-transfer.png' },
  { id: 'credit_card', name: 'Kartu Kredit', logo: '/images/credit-card.png' },
  { id: 'gopay', name: 'GoPay', logo: '/images/gopay.png' },
  { id: 'ovo', name: 'OVO', logo: '/images/ovo.png' }
])

const banks = ref([
  { code: 'bca', name: 'BCA', logo: '/images/bca.png' },
  { code: 'bni', name: 'BNI', logo: '/images/bni.png' },
  { code: 'bri', name: 'BRI', logo: '/images/bri.png' },
  { code: 'mandiri', name: 'Mandiri', logo: '/images/mandiri.png' }
])

// Computed properties
const filteredCities = computed(() => {
  if (!shippingInfo.value.province) return []
  const province = provinces.value.find(p => p.name === shippingInfo.value.province)
  return province ? cities.value.filter(city => city.provinceId === province.id) : []
})

const shippingPrice = computed(() => {
  const method = shippingOptions.value.find(opt => opt.id === shippingInfo.value.shippingMethod)
  return method ? method.price : 0
})

const totalPayment = computed(() => {
  return cartStore.totalPrice + shippingPrice.value
})

const paymentMethodName = computed(() => {
  const method = paymentMethods.value.find(m => m.id === paymentInfo.value.method)
  if (method?.id === 'bank_transfer') {
      const bank = banks.value.find(b => b.code === paymentInfo.value.bank)
      return bank ? `Transfer ${bank.name}` : 'Transfer Bank';
  }
  return method ? method.name : ''
})

const shippingAddress = computed(() => {
  return `${shippingInfo.value.address}, ${shippingInfo.value.district}, ${shippingInfo.value.city}, ${shippingInfo.value.province}, ${shippingInfo.value.postalCode}`
})

// Methods
const goToStep = (step) => {
  currentStep.value = step
}

const submitOrder = () => {
  // Simulate API call
  setTimeout(() => {
    cartStore.clearCart()
    toast.success('Pesanan berhasil dibuat!', {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT
    })
    goToStep(4)
  }, 1500)
}

// Pre-fill customer info if logged in
onMounted(() => {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated && authStore.currentUser) {
    customerInfo.value = {
      fullName: authStore.currentUser.username,
      email: authStore.currentUser.email || '',
      phone: authStore.currentUser.phone || ''
    }
  }
})
</script>

<style scoped>
/* --- Main Layout & Header --- */
.checkout-page {
  padding: 40px 0;
  background-color: var(--color-background);
  min-height: calc(100vh - 160px);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.checkout-header {
  margin-bottom: 40px;
  text-align: center;
}

.checkout-header h1 {
  font-size: 2.5rem;
  color: var(--color-text-primary);
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}
.checkout-header h1 i {
  color: var(--color-primary);
}

/* --- Step Indicator --- */
.checkout-steps {
  display: flex;
  justify-content: center;
  position: relative;
  max-width: 100%;
}
/* Garis konektor abu-abu di belakang */
.checkout-steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: var(--color-border);
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
  color: var(--color-text-secondary);
  transition: color var(--transition-speed);
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 10px;
  transition: all var(--transition-speed);
}

.step-title {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Tampilan Step yang Aktif */
.step.active {
  color: var(--color-primary);
}

.step.active .step-number {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  box-shadow: 0 0 15px rgba(74, 105, 189, 0.5);
}

/* --- Main Content Card --- */
.checkout-content {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 40px;
  border: 1px solid var(--color-border);
}

.checkout-step h2 {
  font-size: 1.8rem;
  color: var(--color-text-primary);
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

/* --- Form Styles --- */
.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  transition: all var(--transition-speed);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 105, 189, 0.3);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-row {
  display: flex;
  gap: 25px;
}
.form-row .form-group {
  flex: 1;
}

/* --- Custom Option Styles (Shipping & Payment) --- */
.shipping-options,
.payment-options,
.bank-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}
.bank-options {
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  margin-top: 15px;
}

.shipping-options label,
.payment-options label,
.bank-options label {
  position: relative;
  cursor: pointer;
}

.shipping-options input,
.payment-options input,
.bank-options input {
  position: absolute;
  opacity: 0;
}

.option-card, .payment-card, .bank-card {
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 15px;
  transition: all var(--transition-speed);
  text-align: center;
}
.option-card {
  display: flex;
  align-items: center;
  gap: 15px;
  text-align: left;
}

/* Tampilan Opsi yang Aktif */
.shipping-options .active .option-card,
.payment-options .active .payment-card,
.bank-options .active .bank-card {
  border-color: var(--color-primary);
  background: rgba(74, 105, 189, 0.1);
}

.option-icon {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.payment-logo, .bank-logo {
  height: 30px;
  margin-bottom: 10px;
  object-fit: contain;
  filter: grayscale(100%) opacity(0.7); /* Membuat logo B/W */
  transition: filter var(--transition-speed);
}
.active .payment-logo, .active .bank-logo {
  filter: grayscale(0%) opacity(1); /* Warna asli saat aktif */
}

/* --- Order Summary --- */
.order-summary {
  background: var(--color-background);
  border-radius: var(--border-radius);
  padding: 25px;
  margin: 30px 0;
  border: 1px solid var(--color-border);
}

.order-summary h3 {
  font-size: 1.3rem;
  color: var(--color-text-primary);
  margin: 0 0 15px 0;
}

.summary-divider {
  height: 1px;
  background: var(--color-border);
  margin: 15px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  color: var(--color-text-secondary);
}
.summary-row.total {
  font-weight: 600;
  font-size: 1.2rem;
  color: var(--color-text-primary);
}
.summary-row.total span:last-child {
  color: var(--color-secondary);
}

/* --- Action Buttons --- */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
}

.btn-prev, .btn-next, .btn-pay {
  padding: 12px 25px;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed);
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  font-size: 1rem;
}

.btn-prev {
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}
.btn-prev:hover {
  background-color: var(--color-border);
  color: var(--color-text-primary);
}

.btn-next, .btn-pay {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 4px 15px rgba(74, 105, 189, 0.2);
}
.btn-next:hover, .btn-pay:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 105, 189, 0.4);
}

.btn-pay {
  background: var(--color-secondary); /* Warna oranye untuk tombol bayar */
  box-shadow: 0 4px 15px rgba(240, 147, 43, 0.2);
}
.btn-pay:hover {
  box-shadow: 0 6px 20px rgba(240, 147, 43, 0.4);
}

/* --- Order Complete Step --- */
.order-complete {
  text-align: center;
  padding: 40px 20px;
}

.complete-icon {
  font-size: 6rem;
  color: var(--color-secondary);
  margin-bottom: 25px;
}

.order-complete h2 {
  font-size: 2.5rem;
  border: none;
}

.order-number {
  font-size: 1.2rem;
  color: var(--color-primary);
  font-weight: 500;
}

.order-complete p {
  color: var(--color-text-secondary);
  max-width: 550px;
  margin: 15px auto 30px;
  line-height: 1.7;
}

.order-details {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 25px;
  max-width: 550px;
  margin: 0 auto 30px;
  text-align: left;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}
.detail-row:last-child { border: none; }
.detail-row span:last-child { font-weight: 500; color: var(--color-text-primary); }

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-view-orders, .btn-continue-shopping {
  padding: 12px 25px;
  border-radius: var(--border-radius);
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all var(--transition-speed);
}

.btn-view-orders {
  background: var(--color-primary);
  color: white;
}
.btn-view-orders:hover {
  transform: translateY(-2px);
}

.btn-continue-shopping {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
.btn-continue-shopping:hover {
  background-color: var(--color-border);
}

@media (max-width: 768px) {
  .checkout-content { padding: 25px; }
  .form-row { flex-direction: column; gap: 0; }
  .form-actions { flex-direction: column; gap: 15px; }
  .btn-prev, .btn-next, .btn-pay { width: 100%; justify-content: center; }
  .step-title { display: none; } /* Sembunyikan judul di mobile */
}
</style>