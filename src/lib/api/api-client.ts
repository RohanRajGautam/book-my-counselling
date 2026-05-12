import axios from 'axios'

// Shared Axios client configured with the public API base URL.
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  paramsSerializer: {
    indexes: null,
  },
})

export default apiClient
