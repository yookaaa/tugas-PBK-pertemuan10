<template>
  <div class="auth-container">
    <div class="auth-card">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <input type="text" v-model="username" placeholder="Username" required />
          <input type="password" v-model="password" placeholder="Password" required />
          <button type="submit" :disabled="authStore.loading">
            {{ authStore.loading ? 'Loading...' : 'Login' }}
          </button>
        </form>
        <p>Belum punya akun? <router-link to="/register">Daftar di sini</router-link>.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  const success = await authStore.login({ 
    username: username.value, 
    password: password.value 
  });
  if (success) {
      router.push('/account');
  }
};
</script>

<style scoped>
.auth-container { max-width: 400px; margin: 50px auto; padding: 20px; }
.auth-card {
    background: var(--color-surface);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    border: 1px solid var(--color-border);
}
h2 {
    text-align: center;
    color: var(--color-text-primary);
    margin-bottom: 1.5rem;
}
input { 
    display: block; 
    width: 100%; 
    padding: 12px; 
    margin-bottom: 1rem; 
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border);
    background-color: var(--color-background);
    color: var(--color-text-primary);
}
button { 
    padding: 12px 20px; 
    width: 100%; 
    background-color: var(--color-primary); 
    color: white; 
    border: none; 
    cursor: pointer;
    border-radius: var(--border-radius);
    font-weight: 600;
    transition: background-color 0.3s;
}
button:hover:not(:disabled) {
    background-color: #3b56a1;
}
button:disabled { 
    background-color: var(--color-text-secondary); 
    cursor: not-allowed; 
}
p {
    text-align: center;
    margin-top: 1rem;
    color: var(--color-text-secondary);
}
p a {
    color: var(--color-primary);
    font-weight: 500;
    text-decoration: none;
}
</style>