import api from './api'

export const getHistory   = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.entityType) params.set('entityType', filters.entityType)
  if (filters.action)     params.set('action',     filters.action)
  return (await api.get(`/history?${params}`)).data.data
}

export const getHistoryById = async (id) => (await api.get(`/history/${id}`)).data.data
