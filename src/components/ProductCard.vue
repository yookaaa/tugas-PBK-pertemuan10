<template>
  <div class="product-card" :class="{ 'out-of-stock': product.stock === 0 }">
    <div class="product-badge" v-if="product.discount">-{{ product.discount }}%</div>
    <div class="product-image-container">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <button 
        class="quick-view-btn" 
        @click.stop="$emit('quickView', product)"
      >
        <i class="fas fa-eye"></i> Quick View
      </button>
    </div>
    <div class="product-details">
      <h3 class="product-title">{{ product.name }}</h3>
      <div class="product-category">{{ formatCategory(product.category) }}</div>
      <p class="product-description">{{ truncateDescription(product.description) }}</p>
      
      <div class="price-section">
        <span class="current-price">Rp{{ calculateDiscount(product.price, product.discount).toLocaleString() }}</span>
        <span class="original-price" v-if="product.discount">Rp{{ product.price.toLocaleString() }}</span>
      </div>
      
      <div class="stock-section">
        <span v-if="product.stock > 0" class="in-stock">
          <i class="fas fa-check-circle"></i> Stok: {{ product.stock }}
        </span>
        <span v-else class="out-of-stock-text">
          <i class="fas fa-times-circle"></i> Stok Habis
        </span>
      </div>
      
      <button 
        class="add-to-cart-btn" 
        @click="$emit('addToCart', product)" 
        :disabled="product.stock === 0"
      >
        <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

defineEmits(['addToCart', 'quickView']);

const formatCategory = (category) => {
  const categories = {
    'novel': 'Novel',
    'biografi': 'Biografi',
    'fiksi-ilmiah': 'Fiksi Ilmiah'
  };
  return categories[category] || category;
};

const truncateDescription = (desc) => {
  return desc.length > 60 ? desc.substring(0, 60) + '...' : desc;
};

const calculateDiscount = (price, discount) => {
  return discount ? Math.round(price * (1 - discount/100)) : price;
};
</script>

<style scoped>
/* src/components/ProductCard.vue -> style scoped */

/* Menggunakan font dari Google Fonts dan Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.product-card {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Disesuaikan dengan tema baru */
  transition: all var(--transition-speed) ease;
  font-family: var(--font-family);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15); /* Disesuaikan dengan tema baru */
  border-color: var(--color-primary);
}

.product-card.out-of-stock {
  opacity: 0.6;
}

.product-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--color-danger);
  color: white;
  padding: 5px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
}

.product-image-container {
  position: relative;
  width: 100%;
  padding-top: 100%; /* Membuat aspect ratio 1:1 */
  overflow: hidden;
  background-color: #fff; /* Latar belakang putih untuk gambar produk */
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain; /* Gunakan contain agar produk tidak terpotong */
  padding: 10px; /* Beri sedikit padding pada gambar */
  transition: transform var(--transition-speed) ease;
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.quick-view-btn {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  opacity: 0;
}

.product-card:hover .quick-view-btn {
  bottom: 15px;
  opacity: 1;
}

.product-details {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Membuat bagian ini mengisi sisa ruang */
}

.product-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-category {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.product-description {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0 0 15px 0;
  line-height: 1.5;
  min-height: 40px;
  flex-grow: 1;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
}

.current-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.original-price {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  text-decoration: line-through;
}

.stock-section {
  margin-bottom: 15px;
  font-size: 0.85rem;
}

.in-stock {
  color: var(--color-secondary);
}

.out-of-stock-text {
  color: var(--color-danger);
}

.add-to-cart-btn {
  width: 100%;
  background: linear-gradient(45deg, var(--color-primary), #7c96e6);
  color: white;
  border: none;
  padding: 12px;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: auto; /* Mendorong tombol ke bawah */
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 105, 189, 0.4);
}

.add-to-cart-btn:disabled {
  background: var(--color-border);
  cursor: not-allowed;
}
</style>