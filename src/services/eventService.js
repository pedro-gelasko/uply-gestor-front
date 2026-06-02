import api from './api'

export const getEvents = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.calendarId) params.set('calendarId', filters.calendarId)
  if (filters.category)   params.set('category',   filters.category)
  if (filters.status)     params.set('status',      filters.status)
  return (await api.get(`/events?${params}`)).data.data
}

export const getEventById = async (id)          => (await api.get(`/events/${id}`)).data.data
export const createEvent  = async (payload)     => (await api.post('/events', payload)).data.data
export const updateEvent  = async (id, payload) => (await api.put(`/events/${id}`, payload)).data.data
export const deleteEvent  = async (id)          => api.delete(`/events/${id}`)
