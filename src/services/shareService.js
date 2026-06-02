import api from './api'

export const getShares      = async ()           => (await api.get('/shares')).data.data
export const getPublicShare = async (token)      => (await api.get(`/shares/public/${token}`)).data.data
export const createShare    = async (payload)    => (await api.post('/shares', payload)).data.data
export const deleteShare    = async (id)         => api.delete(`/shares/${id}`)
