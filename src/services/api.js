import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Servidor demorando para responder. Aguarde e tente novamente.'))
    }
    const data = err.response?.data
    const errors = data?.errors?.map(e => e.message).join(', ')
    const message = errors || data?.message || err.message || 'Erro de conexão com o servidor'
    return Promise.reject(new Error(message))
  }
)

export default api
