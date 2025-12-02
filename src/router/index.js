import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.store'

const routes = [
  {
    path: '/',
    component: () => import('@/resources/views/appointments/NewAppointmentView.vue'),
  },
  {
    path: '/login',
    component: () => import('@/resources/views/auth/LoginView.vue'),
  },
  {
    path: '/logout',
    component: () => import('@/resources/views/auth/LogoutView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/register',
    component: () => import('@/resources/views/auth/RegisterView.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/appointments',
    component: () => import('@/resources/views/appointments/AppointmentsView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const store = useUserStore()

  if (to.meta.requiresAuth && !store.user) {
    console.log('41')
    return '/login'
  }

  console.log(store.user?.role)

  if (
    (store.user && (to.path === '/login' || to.path === '/')) ||
    (to.meta.role && store.user?.role !== to.meta.role)
  ) {
    console.log('49')
    return '/appointments'
  }
})

export default router
