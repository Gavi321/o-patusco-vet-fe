<script setup>
import { ref } from 'vue'
import { ElCard, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
import { useUserStore } from '@/stores/user.store'
import router from '@/router'

const userStore = useUserStore()

const loginObj = ref({
  email: null,
  password: null,
})

const loginForm = ref()
const errorMessage = ref()

const rules = {
  email: [
    { required: true, message: 'Por favor insere um email', trigger: 'blur' },
    { type: 'email', message: 'Por favor insere um email válido', trigger: ['blur', 'change'] },
  ],
  password: [{ required: true, message: 'Por favor insere uma password', trigger: 'blur' }],
}

const loginAction = async () => {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      userStore
        .login(loginObj.value)
        .then((response) => {
          if(response.status >= 200 && response.status < 300) {
            router.push('/appointments')
          } else {
            errorMessage.value = 'Erro, tente novamente'
          }
        })
        .catch(() => {
          errorMessage.value = 'Erro, tente novamente'
        })
    }
  })
}
</script>

<template>
  <div class="flex flex-col gap-5 items-center justify-center w-full h-[90vh]">
    <h3 class="!font-bold">O Patusco</h3>

    <el-card class="login-container">
      <el-form
        ref="loginForm"
        :model="loginObj"
        :rules="rules"
        label-position="top"
        class="!mt-3"
        @submit="loginAction"
      >
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="loginObj.email"
            type="email"
            autocomplete="off"
            @keyup="errorMessage = null"
          />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="loginObj.password"
            type="password"
            autocomplete="off"
            @keyup="errorMessage = null"
          />
        </el-form-item>
        <div v-if="errorMessage"
             class="text-[13px] !w-full !mb-3 p-1 border border-red-300 bg-red-50 text-red-500 rounded-[3px]"
        >{{ errorMessage }}
        </div>
        <el-button type="primary" plain class="!w-full" @click="loginAction"> Login </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 600px;
  min-width: 400px;
  padding: 10px 20px;
}
</style>
