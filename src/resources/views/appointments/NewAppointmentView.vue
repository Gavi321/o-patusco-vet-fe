<script setup>
import { ref } from 'vue'
import { ElCard } from 'element-plus'
import { appointmentsService } from '@/services/appointments.service'
import { RouterLink } from 'vue-router'
import AppointmentForm from '@/components/appointments/AppointmentForm.vue'
import { useUserStore } from '@/stores/user.store'

const appointment = ref({
  person_name: '',
  email: '',
  animal_name: '',
  animal_type: '',
  animal_age: '',
  symptoms: '',
  date: '',
  period: '',
})

const saveAppointment = async () => {
  appointmentsService.create(appointment.value).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      // Reset form after successful submission
      appointment.value = {
        person_name: '',
        email: '',
        animal_name: '',
        animal_type: '',
        animal_age: '',
        symptoms: '',
        date: '',
        period: '',
      }
    }
  })
}
</script>

<template>
  <div class="flex flex-col gap-5 items-center justify-center w-full">
    <h2 class="text-center">Novo Agendamento</h2>

    <el-card class="max-w-[700px] min-w-[500px] !mx-auto !mt-5 !p-3">
      <appointment-form v-model="appointment" @submit="saveAppointment" />

      <p v-if="!useUserStore().user" class="!mt-10 text-center">
        É um funcionário da clínica? Por favor,
        <RouterLink to="/login" class="text-blue-500 underline"> autentique-se </RouterLink>
      </p>
    </el-card>
  </div>
</template>
