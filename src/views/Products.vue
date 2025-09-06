<template>
  <div class="products-page">
    <div class="products-header">
      <div class="container">
        <h1>Koleksi Buku Kami</h1>
        <p>Temukan koleksi lengkap buku-buku terbaik dari berbagai genre</p>
      </div>
    </div>
    
    <div class="products-toolbar">
      <div class="container">
        <div class="toolbar-content">
          <div class="filter-controls">
            <div class="filter-group">
              <label for="category-filter">Kategori:</label>
              <select 
                id="category-filter" 
                v-model="selectedCategory"
                @change="updateRoute"
              >
                <option value="">Semua Kategori</option>
                <option 
                  v-for="category in productStore.categories" 
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="sort-filter">Urutkan:</label>
              <select 
                id="sort-filter" 
                v-model="selectedSort"
              >
                <option value="default">Default</option>
                <option value="price-asc">Harga: Rendah ke Tinggi</option>
                <option value="price-desc">Harga: Tinggi ke Rendah</option>
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
                <option value="newest">Terbaru</option>
              </select>
            </div>
          </div>
          
          <div class="search-control">
            <input 
              type="text" 
              placeholder="Cari buku atau penulis..." 
              v-model="searchQuery"
              @input="updateRoute"
            />
            <i class="fas fa-search"></i>
          </div>
        </div>
      </div>
    </div>
    
    <div class="products-content">
      <div class="container">
        <div v-if="productStore.isLoading" class="loading-products">
          <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
          <p>Memuat produk...</p>
        </div>
        
        <div v-else>
          <div v-if="filteredProducts.length > 0" class="products-grid">
            <ProductCard 
              v-for="product in filteredProducts" 
              :key="product.id" 
              :product="product"
              @addToCart="handleAddToCart"
              @quickView="handleQuickView"
            />
          </div>
          
          <div v-else class="no-products">
            <i class="fas fa-box-open"></i>
            <h3>Tidak ada buku yang ditemukan</h3>
            <p>Coba ubah filter pencarian Anda</p>
            <button class="reset-filters" @click="resetFilters">
              Reset Filter
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="modal-overlay" v-if="showQuickView" @click.self="closeQuickView">
      <div class="quick-view-modal">
        <button class="close-modal" @click="closeQuickView">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="modal-content" v-if="selectedProduct">
          <div class="product-images">
            <img 
              :src="currentImage" 
              :alt="selectedProduct.name" 
              class="main-image" 
            />
            <div class="thumbnail-container">
              <img
                v-for="(img, index) in productImages"
                :key="index"
                :src="img"
                :alt="selectedProduct.name + ' thumbnail ' + (index + 1)"
                :class="{ active: img === currentImage }"
                @click="currentImage = img"
              />
            </div>
          </div>
          
          <div class="product-details">
            <h2>{{ selectedProduct.name }}</h2>
            <div class="product-meta">
              <span class="product-category">{{ formatCategory(selectedProduct.category) }}</span>
              <span class="product-sku">SKU: {{ selectedProduct.id }}</span>
            </div>
            
            <div class="product-price">
              <span class="current-price">Rp{{ calculateDiscount(selectedProduct.price, selectedProduct.discount).toLocaleString() }}</span>
              <span class="original-price" v-if="selectedProduct.discount">
                Rp{{ selectedProduct.price.toLocaleString() }}
              </span>
              <span class="discount-badge" v-if="selectedProduct.discount">
                -{{ selectedProduct.discount }}%
              </span>
            </div>
            
            <div class="product-stock">
              <span v-if="selectedProduct.stock > 0" class="in-stock">
                <i class="fas fa-check-circle"></i> Tersedia: {{ selectedProduct.stock }} pcs
              </span>
              <span v-else class="out-of-stock">
                <i class="fas fa-times-circle"></i> Stok Habis
              </span>
            </div>
            
            <div class="product-description">
              <h3>Deskripsi Produk</h3>
              <p>{{ selectedProduct.description }}</p>
            </div>
            
            <div class="product-actions">
              <div class="quantity-control">
                <button 
                  class="quantity-btn" 
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                >
                  <i class="fas fa-minus"></i>
                </button>
                <input 
                  type="number" 
                  v-model.number="quantity"
                  min="1"
                  :max="selectedProduct.stock"
                  @change="validateQuantity"
                />
                <button 
                  class="quantity-btn" 
                  @click="increaseQuantity"
                  :disabled="quantity >= selectedProduct.stock"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              
              <button 
                class="add-to-cart-btn"
                @click="addToCartFromModal"
                :disabled="selectedProduct.stock === 0"
              >
                <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
              </button>
            </div>
            
            <div class="product-share">
              <span>Bagikan:</span>
              <a href="#"><i class="fab fa-facebook"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-whatsapp"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import ProductCard from '@/components/ProductCard.vue'
import { toast } from 'vue3-toastify'

const productStore = useProductStore()
const cartStore = useCartStore()
const route = useRoute()
const router = useRouter()

// Filter states
const selectedCategory = ref('')
const selectedSort = ref('default')
const searchQuery = ref('')

// Quick view modal states
const showQuickView = ref(false)
const selectedProduct = ref(null)
const quantity = ref(1)

const currentImage = ref('');

const productImages = computed(() => {
  if (!selectedProduct.value) return [];
  // Asumsi hanya ada satu gambar utama
  return [selectedProduct.value.image]; 
});

const handleQuickView = (product) => {
  selectedProduct.value = product;
  currentImage.value = product.image; // Atur gambar utama saat modal dibuka
  quantity.value = 1;
  showQuickView.value = true;
};

// Filtered products
const filteredProducts = computed(() => {
  let products = [...productStore.products]
  
  if (selectedCategory.value) {
    products = products.filter(p => p.category === selectedCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    )
  }
  
  switch (selectedSort.value) {
    case 'price-asc':
      return products.sort((a, b) => calculateDiscount(a.price, a.discount) - calculateDiscount(b.price, b.discount))
    case 'price-desc':
      return products.sort((a, b) => calculateDiscount(b.price, b.discount) - calculateDiscount(a.price, a.discount))
    case 'name-asc':
      return products.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return products.sort((a, b) => b.name.localeCompare(a.name))
    case 'newest':
      // Asumsikan ada properti createdAt di data produk Anda
      return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    default:
      return products
  }
})

watch(
  () => route.query,
  (query) => {
    selectedCategory.value = query.category || ''
    searchQuery.value = query.search || ''
  },
  { immediate: true }
)

const formatCategory = (category) => {
  const cat = productStore.categories.find(c => c.id === category)
  return cat ? cat.name : category;
}

const calculateDiscount = (price, discount) => {
  if (!discount) return price;
  return Math.round(price * (1 - discount / 100));
}

const updateRoute = () => {
  const query = {}
  if (selectedCategory.value) query.category = selectedCategory.value
  if (searchQuery.value) query.search = searchQuery.value
  
  router.replace({ path: '/products', query })
}

const resetFilters = () => {
  selectedCategory.value = ''
  selectedSort.value = 'default'
  searchQuery.value = ''
  updateRoute()
}

const handleAddToCart = (product) => {
  cartStore.addToCart(product)
}

const closeQuickView = () => {
  showQuickView.value = false
}

const addToCartFromModal = () => {
  if (!selectedProduct.value) return
  
  const productToAdd = { ...selectedProduct.value };
  
  cartStore.addToCart(productToAdd, quantity.value)
  closeQuickView()
}

const increaseQuantity = () => {
  if (quantity.value < selectedProduct.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const validateQuantity = () => {
  if(quantity.value > selectedProduct.value.stock) {
    quantity.value = selectedProduct.value.stock;
  }
  if(quantity.value < 1) {
    quantity.value = 1;
  }
}

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.fetchProducts()
  }
})
</script>

<style scoped>
/* src/views/Products.vue -> style scoped */
.products-page {
  padding-bottom: 60px;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.products-header {
  background: linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.8)), 
              url('@/assets/images/books-bg.jpg') no-repeat center center;
  background-size: cover;
  color: var(--color-text-primary);
  text-align: center;
  padding: 80px 20px;
  border-radius: var(--border-radius);
  margin: 0 20px 40px 20px;
}

.products-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 15px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.products-header p {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.products-toolbar {
  background: var(--color-surface);
  box-shadow: var(--box-shadow);
  padding: 15px 20px;
  margin-bottom: 30px;
  position: sticky;
  top: 95px; /* Sesuaikan dengan tinggi header Anda */
  z-index: 90;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.toolbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-controls {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.filter-group label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.filter-group select, .search-control input {
  padding: 10px 15px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  cursor: pointer;
  min-width: 180px;
  transition: all var(--transition-speed);
}

.filter-group select:focus, .search-control input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 105, 189, 0.3);
}

.search-control {
  position: relative;
}

.search-control i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
}

.search-control input {
  padding-left: 40px;
  width: 280px;
}

.loading-products, .no-products {
  text-align: center;
  padding: 80px 0;
  color: var(--color-text-secondary);
}

.loading-spinner, .no-products i {
  font-size: 4rem;
  margin-bottom: 20px;
  color: var(--color-primary);
  opacity: 0.8;
}

.no-products i {
  color: var(--color-text-secondary);
  opacity: 0.5;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.reset-filters {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 500;
  margin-top: 15px;
}
.reset-filters:hover {
  background-color: #3b56a1;
}


/* Quick View Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.quick-view-modal {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: var(--border-radius);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid var(--color-border);
  display: flex;
  box-shadow: var(--box-shadow);
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0,0,0,0.1);
  border-radius: 50%;
  border: none;
  width: 32px;
  height: 32px;
  font-size: 1rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-modal:hover {
  color: white;
  background: var(--color-danger);
  transform: rotate(90deg);
}

.modal-content {
  padding: 40px;
  display: flex;
  gap: 30px;
  width: 100%;
}

.product-images {
  flex: 1;
}

.main-image {
  width: 100%;
  height: 350px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid var(--color-border);
  background: white;
}

.thumbnail-container {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.thumbnail-container img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 6px;
  border: 2px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s;
  padding: 5px;
  background-color: #fff;
}

.thumbnail-container img:hover {
  border-color: #888;
}

.thumbnail-container img.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 10px rgba(74, 105, 189, 0.5);
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-details h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 1.2;
  color: var(--color-text-primary);
}

.product-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.product-price {
  margin-bottom: 20px;
  display: flex;
  align-items: baseline;
  gap: 15px;
}

.product-price .current-price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.product-price .original-price {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  text-decoration: line-through;
}

.product-price .discount-badge {
  background: var(--color-danger);
  color: white;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.product-stock {
  margin-bottom: 20px;
  font-weight: 500;
}

.in-stock {
  color: var(--color-secondary);
}

.out-of-stock {
  color: var(--color-danger);
}

.product-description {
  margin-bottom: 25px;
  flex-grow: 1;
}

.product-description h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 10px;
  color: var(--color-text-primary);
}

.product-description p {
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.product-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.quantity-btn {
  width: 45px;
  height: 45px;
  background: var(--color-background);
  border: none;
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: 1rem;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-control input {
  width: 60px;
  height: 45px;
  border: none;
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  text-align: center;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.quantity-control input::-webkit-outer-spin-button,
.quantity-control input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.product-actions .add-to-cart-btn {
  height: 45px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 25px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 1rem;
  flex-grow: 1;
}
.product-actions .add-to-cart-btn:hover:not(:disabled) {
  opacity: 0.9;
  box-shadow: 0 5px 15px rgba(74, 105, 189, 0.3);
}
.product-actions .add-to-cart-btn:disabled {
  background: var(--color-border);
  cursor: not-allowed;
}

.product-share {
  display: flex;
  align-items: center;
  gap: 15px;
  color: var(--color-text-secondary);
}

.product-share a {
  color: var(--color-text-secondary);
  font-size: 1.2rem;
  transition: color 0.3s;
}
.product-share a:hover {
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .modal-content {
    flex-direction: column;
  }
}
</style>