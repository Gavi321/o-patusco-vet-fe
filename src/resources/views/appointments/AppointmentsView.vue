<script setup>
import { onMounted, ref } from 'vue'
import {
  ElCard,
  ElTable,
  ElTableColumn,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElButton,
  ElDatePicker,
  ElSelect,
  ElOption,
} from 'element-plus'
import { appointmentsService } from '@/services/appointments.service'
import AppointmentForm from '@/components/appointments/AppointmentForm.vue'
import { ANIMAL_TYPES } from '@/constants'
import { useAppStore } from '@/stores/app.store'
import { useUserStore } from '@/stores/user.store'
import api from '@/api/axios'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter();

const appointments = ref([])
const users = ref([])

const currentPage = ref(1);
const totalPages = ref(0);
const total = ref(0);

const filters = ref({
  dateRange: [],
  animalTypes: [],
})

const isCreateEditAppointment = ref(false)

const fetchAppointments = async () => {
  appointmentsService.getAll({ ...filters.value, page: currentPage.value }).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      appointments.value = response.data.data
      total.value = response.data.meta?.total
      totalPages.value = response.data.meta?.last_page
    }
  })
}

onMounted(async () => {
  appStore.startLoading()

  await fetchAppointments()

  if (userStore.hasRole('admin')) {
    await api.get('/vets').then((response) => {
      if (response.status >= 200 && response.status < 300) {
        users.value = response.data.data
      }
    })
  }

  appStore.stopLoading()
})

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

const newAppointment = () => {
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

  isCreateEditAppointment.value = true
}

const editAppointment = (row) => {
  appointment.value = {
    id: row.id,
    person_name: row.person_name,
    email: row.email,
    animal_name: row.animal_name,
    animal_type: row.animal_type,
    animal_age: row.animal_age,
    symptoms: row.symptoms,
    date: row.date,
    period: row.period,
  }

  isCreateEditAppointment.value = true
}

const closeAppointment = () => {
  isCreateEditAppointment.value = false

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

const clearAppointment = () => {
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

const saveAppointment = async () => {
  appStore.startLoading()

  if (appointment.value.id) {
    appointmentsService.update(appointment.value).then(async (response) => {
      if (response.status >= 200 && response.status < 300) {
        clearAppointment()

        isCreateEditAppointment.value = false

        await fetchAppointments()
      }
    })
  } else {
    appointmentsService.create(appointment.value).then(async (response) => {
      if (response.status >= 200 && response.status < 300) {
        clearAppointment()

        isCreateEditAppointment.value = false

        await fetchAppointments()
      }
    })
  }

  appStore.stopLoading()
}

const assignVet = async (row) => {
  appStore.startLoading()

  try {
    appointmentsService.assign(row.id, row.vet_id).then(async (response) => {
      if (response.status < 200 || response.status >= 300) {
        await fetchAppointments()
      }
    })
  } catch {
    await fetchAppointments()
  }

  appStore.stopLoading()
}

const deleteAppointment = async (appointmentID) => {
  appStore.startLoading()

  try {
    appointmentsService.delete(appointmentID).then(async (response) => {
      if (response.status >= 200 && response.status < 300) {
        await fetchAppointments()
      }
    })
  } catch {
    await fetchAppointments()
  }

  appStore.stopLoading()
}

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchAppointments();
};
</script>

<template>
  <el-card v-if="isCreateEditAppointment" class="max-w-[700px] !mx-auto !mt-10 !p-3">
    <el-button type="primary" plain class="!mb-5" @click="closeAppointment"> Voltar </el-button>

    <appointment-form v-model="appointment" @submit="saveAppointment" />
  </el-card>

  <div v-else class="p-5">
    <h2 class="text-center mb-5">Agendamentos</h2>
    <div class="flex flex-row justify-between !mb-5">
      <div class="flex flex-row gap-3">
        <el-date-picker
          v-model="filters.dateRange"
          type="daterange"
          range-separator="até"
          start-placeholder="Data início"
          end-placeholder="Data fim"
          value-format="YYYY-MM-DD"
        />
        <el-select
          v-model="filters.animalTypes"
          multiple
          collapse-tags
          placeholder="Tipo de animal"
        >
          <el-option
            v-for="type in ANIMAL_TYPES"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
        <el-button type="primary" plain @click="fetchAppointments"> Filtrar </el-button>
      </div>

      <div v-if="userStore.hasRole('admin')">
        <el-button type="primary" plain @click="newAppointment">
          Novo Agendamento
        </el-button>
        <el-button type="primary" plain @click="router.push('/register')">
          Novo(a) veterinário(a)
        </el-button>
      </div>
    </div>

    <el-table :data="appointments" v-loading="useAppStore().isLoading" style="width: 100%;">
      <el-table-column prop="date" label="Data">
        <template #default="scope">
          {{ dayjs(scope.row.date).format('DD/MM/YYYY') }}
        </template>
      </el-table-column>
      <el-table-column prop="period" label="Periodo">
        <template #default="scope">
          <span>{{ scope.row.period === 'morning' ? 'Manhã' : 'Tarde' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="person_name" label="Nome do cliente" />
      <el-table-column prop="email" label="Email do cliente">
        <template #default="scope">
          <el-tooltip>
            <p class="truncate">{{ scope.row.email }}</p>
            <template #content>
              {{ scope.row.email }}
            </template>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="animal_name" label="Nome do animal" />
      <el-table-column prop="animal_type" label="Tipo de animal">
        <template #default="scope">
          <span>{{
            ANIMAL_TYPES.find((type) => type.value === scope.row.animal_type)?.label ||
            scope.row.animal_type
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="animal_age" label="Idade do animal"></el-table-column>
      <el-table-column prop="symptoms" label="Sintomas">
        <template #default="scope">
          <el-tooltip>
            <p class="truncate">{{ scope.row.symptoms }}</p>
            <template #content>
              {{ scope.row.symptoms }}
            </template>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if="userStore.hasRole('admin')" prop="vet" label="Veterinário">
        <template #default="scope">
          <el-select
            v-model="scope.row.vet_id"
            placeholder="Atribuir veterinário"
            @change="assignVet(scope.row)"
          >
            <el-option
              v-for="(user, index) in users"
              :key="index"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="120">
        <template #default="scope">
          <el-dropdown>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="editAppointment(scope.row)">Editar</el-dropdown-item>
                <el-dropdown-item
                  v-if="userStore.hasRole('admin')"
                  @click="deleteAppointment(scope.row.id)"
                  >Remover</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
            <el-button type="primary" plain> Ações </el-button>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      layout="prev, pager, next, total"
      :current-page="currentPage"
      :page-count="totalPages"
      :total="total"
      @current-change="handlePageChange"
    />
  </div>
</template>
