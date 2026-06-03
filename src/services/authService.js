import api from './api'

const TOKEN_KEY = 'uply_token'
const USER_KEY  = 'uply_user'

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  localStorage.setItem(TOKEN_KEY, data.data.token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.data.user))
  api.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`
  return data.data
}

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  delete api.defaults.headers.common['Authorization']
}

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const getUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
}

export const isAuthenticated = () => !!getToken()

export const initAuth = () => {
  const token = getToken()
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const getUsers   = async () => (await api.get('/auth/users')).data.data
export const createUser = async (payload) => (await api.post('/auth/users', payload)).data.data
export const toggleUser = async (id) => (await api.patch(`/auth/users/${id}/toggle`)).data.data
