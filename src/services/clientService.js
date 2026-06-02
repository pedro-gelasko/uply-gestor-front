import api from './api'

export const getClients    = async () => (await api.get('/clients')).data.data
export const getClientById = async (id) => (await api.get(`/clients/${id}`)).data.data
export const createClient  = async (payload) => (await api.post('/clients', payload)).data.data
export const updateClient  = async (id, payload) => (await api.put(`/clients/${id}`, payload)).data.data
export const deleteClient  = async (id) => api.delete(`/clients/${id}`)
