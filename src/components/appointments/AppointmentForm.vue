<script setup>
import { ref, computed } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
  ElSelect,
  ElOption,
  dayjs,
  ElButton,
} from 'element-plus'
import { ANIMAL_TYPES } from '@/constants'
import { useAppStore } from '@/stores/app.store'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

const appStore = useAppStore()

const emit = defineEmits(['update:modelValue', 'submit'])

const appointment = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const appointmentForm = ref()

const rules = {
  person_name: [
    { required: true, message: 'Por favor insira o nome do responsável', trigger: 'blur' },
    { type: 'string', message: 'Por favor insira apenas texto', trigger: ['blur', 'change'] },
  ],
  email: [
    { required: true, message: 'Por favor insira o email', trigger: 'blur' },
    { type: 'email', message: 'Por favor insira um email válido', trigger: ['blur', 'change'] },
  ],
  animal_name: [
    { required: true, message: 'Por favor insira o nome do animal', trigger: 'blur' },
    { type: 'string', message: 'Por favor insira apenas texto', trigger: ['blur', 'change'] },
  ],
  animal_type: [{ required: true, message: 'Por favor escolha o tipo de animal', trigger: 'blur' }],
  animal_age: [{ required: true, message: 'Por favor insira a idade do animal', trigger: 'blur' }],
  symptoms: [{ required: true, message: 'Por favor insira os sintomas', trigger: 'blur' }],
  date: [{ required: true, message: 'Por favor insira a data do agendamento', trigger: 'blur' }],
  period: [
    { required: true, message: 'Por favor insira o período do agendamento', trigger: 'blur' },
  ],
}

const disabledDates = (time) => {
  const today = new Date()
  return time.getTime() < today.setHours(17, 30, 0, 0)
}

const morningDisabled = computed(() => {
  if (appointment.value.date && dayjs(appointment.value.date).isSame(dayjs(), 'day')) {
    if (dayjs().hour() < 12) {
      return false
    }

    return true
  }

  return false
})

const saveAppointment = () => {
  appStore.startLoading()

  appointmentForm.value.validate((valid) => {
    if (valid) {
      emit('submit')
    } else {
      return false
    }
  })

  appStore.stopLoading()
}
</script>

<template>
  <el-form
    ref="appointmentForm"
    v-loading="useAppStore().isLoading"
    :rules="rules"
    :model="appointment"
    label-position="top"
  >
    <el-form-item label="Nome do Responsável" prop="person_name">
      <el-input v-model="appointment.person_name" type="text" maxlength="255" />
    </el-form-item>

    <el-form-item label="Email" prop="email">
      <el-input v-model="appointment.email" type="email" maxlength="255" />
    </el-form-item>

    <el-form-item label="Nome do Animal" prop="animal_name">
      <el-input v-model="appointment.animal_name" type="text" maxlength="255" />
    </el-form-item>

    <el-form-item label="Tipo de Animal" prop="animal_type">
      <el-select v-model="appointment.animal_type" placeholder="Escolha o tipo de animal">
        <el-option
          v-for="(type, index) in ANIMAL_TYPES"
          :label="type.label"
          :value="type.value"
          :key="index"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="Idade do Animal" prop="animal_age">
      <el-input v-model="appointment.animal_age" type="number" :max="100" />
    </el-form-item>

    <el-form-item label="Sintomas" prop="symptoms">
      <el-input type="textarea" v-model="appointment.symptoms" maxlength="1000" />
    </el-form-item>

    <el-form-item label="Data do Agendamento" prop="date">
      <el-date-picker
        v-model="appointment.date"
        type="date"
        :disabled-date="disabledDates"
        placeholder="Escolha a data"
        value-format="YYYY-MM-DD"
        format="DD/MM/YYYY"
      />
    </el-form-item>

    <el-form-item label="Período do Agendamento" prop="period">
      <el-select v-model="appointment.period" placeholder="Escolha o período">
        <el-option label="Manhã" value="morning" :disabled="morningDisabled" />
        <el-option label="Tarde" value="afternoon" />
      </el-select>
    </el-form-item>
  </el-form>

  <el-button type="primary" class="!mt-5 float-right" @click="saveAppointment">Agendar</el-button>
</template>
