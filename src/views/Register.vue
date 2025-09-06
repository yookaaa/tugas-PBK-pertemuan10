<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Buat Akun Baru</h2>
      <form @submit.prevent="handleRegister">
        <input v-model="username" placeholder="Username" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? 'Mendaftar...' : 'Register' }}
        </button>
        <p class="message">Sudah punya akun? <router-link to="/login">Login di sini</router-link></p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';

const username = ref('');
const email = ref('');
const password = ref('');
const authStore = useAuthStore();

const handleRegister = async () => {
  const newUser = {
    username: username.value,
    email: email.value,
    password: password.value,
  };
  // authStore.register akan menambahkan createdAt secara otomatis
  await authStore.register(newUser);
};
</script>

<style scoped>
.register-container { max-width: 400px; margin: 40px auto; padding: 20px; }
.register-card { 
    background: var(--color-surface); 
    padding: 30px; 
    border-radius: var(--border-radius); 
    box-shadow: var(--box-shadow); 
    border: 1px solid var(--color-border);
}
h2 { 
    margin-bottom: 20px; 
    color: var(--color-text-primary); 
    text-align: center; 
}
form { display: flex; flex-direction: column; }
input { 
    margin-bottom: 15px; 
    padding: 12px; 
    border-radius: var(--border-radius); 
    border: 1px solid var(--color-border); 
    font-size: 1rem; 
    background-color: var(--color-background);
    color: var(--color-text-primary);
}
button { 
    padding: 12px; 
    background-color: var(--color-primary); 
    color: white; 
    border: none; 
    border-radius: var(--border-radius); 
    cursor: pointer; 
    font-size: 1rem;
    font-weight: 600; 
    transition: background-color 0.2s; 
}
button:hover:not(:disabled) { 
    background-color: #3b56a1; 
}
button:disabled {
    background-color: var(--color-text-secondary);
    cursor: not-allowed;
}
.message { margin-top: 15px; font-size: 14px; text-align: center; color: var(--color-text-secondary); }
.message a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
}
</style>