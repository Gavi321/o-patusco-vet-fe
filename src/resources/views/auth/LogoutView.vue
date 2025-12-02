<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user.store'
import router from '@/router'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.logout()
  router.push('/login')
})
</script>

<template>&nbsp;</template>
