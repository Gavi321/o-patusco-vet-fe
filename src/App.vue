<script setup>
import { useUserStore } from './stores/user.store'
import { ElMenu, ElMenuItem } from 'element-plus'

const userStore = useUserStore()
</script>

<template>
  <el-menu v-if="userStore.user" mode="horizontal">
    <template #default>
      <el-menu-item>
        <!-- <template #default> -->
        <p class="!font-bold !text-[18px]">O Patusco</p>
        <!-- </template> -->
      </el-menu-item>
      <el-menu-item>
        {{
          userStore.user.role == 'admin'
            ? 'Admin'
            : userStore.user.role == 'vet'
              ? 'Veterinário(a)'
              : ''
        }}
        {{ userStore.user.name }}
        <!-- <template #default> -->
        <div
          class="flex flex-row gap-1 items-center justify-end! !ml-7 w-full !h-fit text-[#f54242]"
          @click="userStore.logout"
        >
          <span>Sair</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height="20" width="20">
            <path
              fill="#f54242"
              d="M224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L160 96C107 96 64 139 64 192L64 448C64 501 107 544 160 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480C142.3 480 128 465.7 128 448L128 192C128 174.3 142.3 160 160 160L224 160zM566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L438.6 169.3C426.1 156.8 405.8 156.8 393.3 169.3C380.8 181.8 380.8 202.1 393.3 214.6L466.7 288L256 288C238.3 288 224 302.3 224 320C224 337.7 238.3 352 256 352L466.7 352L393.3 425.4C380.8 437.9 380.8 458.2 393.3 470.7C405.8 483.2 426.1 483.2 438.6 470.7L566.6 342.7z"
            />
          </svg>
        </div>
        <!-- </template> -->
      </el-menu-item>
    </template>
  </el-menu>

  <RouterView></RouterView>
</template>

<style scoped></style>
