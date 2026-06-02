import api from './api'

export const getCalendars   = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.clientId) params.set('clientId', filters.clientId)
  return (await api.get(`/calendars?${params}`)).data.data
}
export const createCalendar = async (payload) => (await api.post('/calendars', payload)).data.data
