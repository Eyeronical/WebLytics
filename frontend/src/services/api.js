import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5002/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please try again')
    }
    throw error
  }
)

export const analyzeWebsite = (url) => api.post('/analyze', { url })

export const getWebsites = (page = 1, limit = 10, search = '') => 
  api.get('/websites', { params: { page, limit, search } })

export const getWebsite = (id) => api.get(`/websites/${id}`)

export const updateWebsite = (id, data) => api.put(`/websites/${id}`, data)

export const deleteWebsite = (id) => api.delete(`/websites/${id}`)

export const getStats = () => api.get('/stats')
