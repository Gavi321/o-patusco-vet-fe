import api from '@/api/axios'
import { useAppStore } from '@/stores/app.store'

const appStore = useAppStore()

export const appointmentsService = {
  async getAll(filters = {}) {
    try {
      appStore.startLoading()

      const params = new URLSearchParams(filters).toString()

      return await api.get(`/appointments?${params}`)
    } catch {
      throw new Error('Error fetching appointments')
    } finally {
      appStore.stopLoading()
    }
  },

  async getMine(filters = {}) {
    try {
      appStore.startLoading()

      const params = new URLSearchParams(filters).toString()

      return await api.get(`/appointments?${params}`)
    } catch {
      throw new Error('Error fetching vet appointments')
    } finally {
      appStore.stopLoading()
    }
  },

  async create(payload) {
    try {
      appStore.startLoading()

      return await api.post('/appointments', payload)
    } catch {
      throw new Error('Error creating appointment')
    } finally {
      appStore.stopLoading()
    }
  },

  async update(payload) {
    try {
      appStore.startLoading()

      return await api.put(`/appointments/${payload.id}`, payload)
    } catch {
      throw new Error('Error updating appointment')
    } finally {
      appStore.stopLoading()
    }
  },

  async assign(appointmentID, vetID) {
    try {
      appStore.startLoading()

      return await api.post(`/appointments/${appointmentID}/assign-vet`, { vet_id: vetID })
    } catch {
      throw new Error('Error assigning appointment')
    } finally {
      appStore.stopLoading()
    }
  },

  async delete(appointmentID) {
    try {
      appStore.startLoading()

      return await api.delete(`/appointments/${appointmentID}`)
    } catch {
      throw new Error('Error deleting appointment')
    } finally {
      appStore.stopLoading()
    }
  },
}
