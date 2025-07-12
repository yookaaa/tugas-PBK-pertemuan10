import { createRouter, createWebHistory } from 'vue-router'

// Imports dari kode baru Anda
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import ProductCategories from '../components/ProductCategories.vue' // Untuk children
import Cart from '../views/Cart.vue'
import Orders from '../views/Orders.vue'
import Account from '../views/Account.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

// Import yang ditambahkan dari perbaikan sebelumnya
import Checkout from '../views/Checkout.vue'

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home 
  },
  { 
    path: '/products', 
    name: 'Products',
    component: Products,
    // Mempertahankan struktur children dari kode baru Anda
    children: [
      {
        path: '',
        name: 'AllProducts',
        component: ProductCategories
      },
      {
        path: 'novel',
        name: 'NovelProducts',
        component: ProductCategories,
        props: { category: 'novel' }
      },
      {
        path: 'biografi',
        name: 'BiografiProducts',
        component: ProductCategories,
        props: { category: 'biografi' }
      },
      {
        path: 'fiksi-ilmiah',
        name: 'FiksiIlmiahProducts',
        component: ProductCategories,
        props: { category: 'fiksi-ilmiah' }
      }
    ]
  },
  { 
    path: '/cart', 
    name: 'Cart', 
    component: Cart 
  },
  // Rute Checkout yang ditambahkan kembali
  { 
    path: '/checkout', 
    name: 'Checkout', 
    component: Checkout,
    meta: { requiresAuth: true }
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login,
    meta: { requiresGuest: true } 
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: Register,
    meta: { requiresGuest: true } 
  },
  // Rute yang butuh login
  { 
    path: '/orders', 
    name: 'Orders', 
    component: Orders,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/account', 
    name: 'Account', 
    component: Account,
    meta: { requiresAuth: true } 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Route Guard Global (tidak diubah)
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const isAuthenticated = !!JSON.parse(localStorage.getItem('user'));

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (requiresGuest && isAuthenticated) {
    next('/account');
  } else {
    next();
  }
});

export default router