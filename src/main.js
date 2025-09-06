import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Impor CSS global
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'vue3-toastify/dist/index.css'
import './style.css'

// Import plugin toastify (default import!)
import Vue3Toastify from 'vue3-toastify'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000
})

app.mount('#app')
