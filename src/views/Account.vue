<template>
  <div class="account-container">
    <div class="account-card" v-if="authStore.isAuthenticated">
      <div class="account-header">
        <h2>Akun Saya</h2>
      </div>
      <div class="user-info">
        <p><strong>Username:</strong> {{ authStore.currentUser.username }}</p>
        <p><strong>Email:</strong> {{ authStore.currentUser.email || "N/A" }}</p>
        <p class="member-since">Member Sejak: {{ new Date(authStore.currentUser.createdAt).toLocaleDateString() || "Tidak diketahui" }}</p>
      </div>
      <div class="quick-links">
        <router-link to="/orders">Lihat Riwayat Pesanan</router-link>
        <router-link to="/products">Lanjut Belanja</router-link>
      </div>
      <button @click="authStore.logout()" class="logout-button">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
const authStore = useAuthStore();
</script>

<style scoped>
/* Scoped Styles for Account.vue */
.account-container { max-width: 700px; margin: 2rem auto; padding: 2rem; }
.account-card { background: var(--color-surface); border-radius: var(--border-radius); padding: 2rem; box-shadow: var(--box-shadow); border: 1px solid var(--color-border); }
.account-header h2 { font-size: 2rem; color: var(--color-text-primary); margin: 0; }
.user-info { margin: 1.5rem 0; border-top: 1px solid var(--color-border); padding-top: 1.5rem; }
.user-info p { margin: 0.5rem 0; font-size: 1rem; color: var(--color-text-primary); }
.member-since { color: var(--color-text-secondary); font-size: 0.9rem; }
.quick-links { display: flex; gap: 1rem; flex-wrap: wrap; margin: 1.5rem 0; }
.quick-links a { background-color: var(--color-primary); color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: var(--border-radius); transition: background-color 0.3s; }
.quick-links a:hover { background-color: #3b56a1; }
.logout-button { background: var(--color-danger); color: #fff; border: none; padding: 0.75rem 1.5rem; border-radius: var(--border-radius); cursor: pointer; font-size: 1rem; transition: background-color 0.3s; }
.logout-button:hover { background: #c0392b; }
</style>