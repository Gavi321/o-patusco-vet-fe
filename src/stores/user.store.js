import { defineStore } from 'pinia'
import api from '../api/axios'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),

  actions: {
    async fetchUser() {
      try {
        const { data } = await api.get('/self')
        this.user = data
      } catch {
        this.logout()
      }
    },

    /**
     * Register a new user. Expects an object with `name`, `email`,
     * `password` and `password_confirmation` (Laravel `confirmed` rule).
     * On success stores the token and user in the store/localStorage.
     */
    async register(payload) {
      try {
        const { data } = await api.post('/register', payload)

        if (data.token) {
          localStorage.setItem('token', data.token)
          api.defaults.headers.common.Authorization = `Bearer ${data.token}`
        }

        this.user = data.user || null
        // persist user snapshot so UI can restore immediately on reload
        if (this.user) localStorage.setItem('user', JSON.stringify(this.user))
        return data
      } catch (err) {
        if (err.response && err.response.data) throw err.response.data
        throw err
      }
    },

    /**
     * Login
     */
    async login(payload) {
      try {
        const { data } = await api.post('/login', payload)
        if (data.token) {
          localStorage.setItem('token', data.token)
          api.defaults.headers.common.Authorization = `Bearer ${data.token}`
        }

        this.user = data.user || null
        if (this.user) localStorage.setItem('user', JSON.stringify(this.user))

        router.push('/appointments')

        return data
      } catch {
        console.log('error no login')
      }
    },

    /**
     * Logout
     */
    async logout() {
      try {
        await api.post('/logout')
      } catch {
        console.error('logout error')
      }

      router.push('/login')

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common.Authorization
      this.user = null
    },

    /**
     * Initialize the store from localStorage (call once on app start).
     */
    async init() {
      // restore cached user immediately so UI can render without waiting
      const cached = localStorage.getItem('user')
      if (cached) {
        try {
          this.user = JSON.parse(cached)
        } catch {
          localStorage.removeItem('user')
        }
      }

      const token = localStorage.getItem('token')
      if (!token) return

      api.defaults.headers.common.Authorization = `Bearer ${token}`
      try {
        const { data } = await api.get('/self')
        this.user = data
        if (this.user) localStorage.setItem('user', JSON.stringify(this.user))
      } catch {
        // token invalid/expired - clear it
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete api.defaults.headers.common.Authorization
        this.user = null
      }
    },

    hasRole(role) {
      return this.user?.role === role
    },
  },
})
