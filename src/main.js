import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

import './assets/base.css'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(ElementPlus)
app.use(router)

// Initialize user store from localStorage before mounting
import { useUserStore } from './stores/user.store'
const userStore = useUserStore()
userStore.init().then(() => {
  app.mount('#app')
})
