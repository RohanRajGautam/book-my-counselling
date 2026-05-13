import axios from 'axios'
import { getAccessToken } from '@/lib/auth/auth'

// Shared Axios client configured with the public API base URL.
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  paramsSerializer: {
    indexes: null,
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export default apiClient
