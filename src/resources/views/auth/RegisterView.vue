<script setup>
import { ref } from 'vue'
import { ElCard, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
import { useUserStore } from '@/stores/user.store'
import { useAppStore } from '@/stores/app.store'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const appStore = useAppStore()
const router = useRouter()

const registerObj = ref({
  name: null,
  email: null,
  password: null,
})

const registerForm = ref()

const rules = {
  name: [{ required: true, message: 'Por favor insere um nome', trigger: 'blur' }],
  email: [
    { required: true, message: 'Por favor insere um email', trigger: 'blur' },
    { type: 'email', message: 'Por favor insere um email válido', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: 'Por favor insere uma password', trigger: 'blur' },
    { min: 6, message: 'Por favor insere uma password com mais de 6 caractéres', trigger: 'blur' },
  ],
}

const registerAction = async () => {
  registerForm.value.validate(async (valid) => {
    if (valid) {
      appStore.startLoading()

      await userStore.register(registerObj.value)

      appStore.stopLoading()
    }
  })
}
</script>

<template>
  <div class="flex flex-col gap-5 items-center justify-center w-full h-[85vh]">
    <h3>O Patusco</h3>

    <el-card class="register-container">
      <h2 class="text-center">Registar novo veterinário</h2>
      <el-form
        ref="registerForm"
        :model="registerObj"
        :rules="rules"
        label-position="top"
        class="!mt-3"
        @submit="registerAction"
      >
        <el-form-item label="Nome" prop="name">
          <el-input v-model="registerObj.name" type="tezt" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="registerObj.email" type="email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="registerObj.password" type="password" autocomplete="off" />
        </el-form-item>

        <div class="flex flex-row justify-between">
          <el-button plain @click="router.push('/appointments')"> Cancelar </el-button>
          <el-button @click="registerAction"> Registar </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.register-container {
  max-width: 600px;
  min-width: 400px;
  padding: 10px 20px;
}
</style>
