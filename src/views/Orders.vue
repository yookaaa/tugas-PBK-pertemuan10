<template>
  <div class="orders-page">
    <h2>📦 Riwayat Pesanan Saya</h2>

    <div v-if="isLoading" class="loading">Memuat pesanan...</div>
    <div v-else-if="orders.length > 0">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
            <h3>Pesanan #{{ order.id }}</h3>
            <span>{{ new Date(order.date).toLocaleDateString() }}</span>
        </div>
        <p :class="['status', order.status.toLowerCase()]"><strong>Status:</strong> {{ order.status }}</p>

        <ul class="item-list">
          <li v-for="item in order.items" :key="item.id">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-qty">x {{ item.quantity }}</span>
          </li>
        </ul>
        <p class="total"><strong>Total:</strong> Rp{{ order.total.toLocaleString() }}</p>
      </div>
    </div>
    <div v-else class="empty-orders">
      <p>Anda belum memiliki riwayat pesanan.</p>
      <router-link to="/products" class="shop-btn">Mulai Belanja</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const orders = ref([]);
const isLoading = ref(true);
const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      const response = await axios.get(`http://localhost:3000/orders?userId=${authStore.currentUser.id}`);
      // Urutkan dari yang terbaru
      orders.value = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    } finally {
      isLoading.value = false;
    }
  } else {
      isLoading.value = false;
  }
});
</script>

<style scoped>
.orders-page { max-width: 900px; margin: 2rem auto; padding: 2rem; }
h2 { text-align: center; margin-bottom: 2rem; color: var(--color-text-primary); }
.order-card { border: 1px solid var(--color-border); border-radius: var(--border-radius); padding: 1.5rem; margin-bottom: 1.5rem; background: var(--color-surface); box-shadow: var(--box-shadow); }
.order-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1rem; }
.order-header h3 { margin: 0; color: var(--color-text-primary); }
.order-header span { font-size: 0.9rem; color: var(--color-text-secondary); }
.status { padding: 5px 10px; border-radius: 15px; color: white; display: inline-block; font-size: 0.9rem; margin-bottom: 1rem; text-transform: capitalize;}
.status.diproses { background-color: var(--color-primary); }
.status.dibatalkan { background-color: var(--color-danger); }
.status.selesai { background-color: var(--color-secondary); }
.item-list { list-style: none; padding: 0; margin-bottom: 1rem; }
.item-list li { padding: 8px 0; display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border);}
.item-list li:last-child { border-bottom: none; }
.item-name { color: var(--color-text-primary); }
.item-qty { color: var(--color-text-secondary); }
.total { text-align: right; font-size: 1.2rem; margin-top: 1rem; color: var(--color-text-primary); }
.loading, .empty-orders { text-align: center; color: var(--color-text-secondary); font-size: 1.2rem; padding: 3rem; }
.empty-orders .shop-btn {
    margin-top: 1rem;
    background-color: var(--color-primary);
    color: white;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    border-radius: var(--border-radius);
    transition: background-color 0.3s;
    display: inline-block;
}
.empty-orders .shop-btn:hover {
    background-color: #3b56a1;
}
</style>