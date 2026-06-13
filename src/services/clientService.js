import api from './api'

const CACHE_TTL = 30_000
let _cache = null
let _cacheTime = 0

export const invalidateClients = () => { _cache = null; _cacheTime = 0 }

export const getClients = async (force = false) => {
  if (!force && _cache && (Date.now() - _cacheTime) < CACHE_TTL) return _cache
  const data = (await api.get('/clients')).data.data
  _cache = data
  _cacheTime = Date.now()
  return data
}

export const getClientById = async (id) => (await api.get(`/clients/${id}`)).data.data

export const createClient = async (payload) => {
  const data = (await api.post('/clients', payload)).data.data
  invalidateClients()
  return data
}

export const updateClient = async (id, payload) => {
  const data = (await api.put(`/clients/${id}`, payload)).data.data
  invalidateClients()
  return data
}

export const deleteClient = async (id) => {
  await api.delete(`/clients/${id}`)
  invalidateClients()
}
