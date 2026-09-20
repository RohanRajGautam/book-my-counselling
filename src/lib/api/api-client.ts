import axios from 'axios'
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '@/lib/auth/auth'

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _isRetry?: boolean
  }
}

interface RefreshResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

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

// One in-flight refresh shared by concurrent 401s. The backend rotates the
// refresh token on every /auth/refresh, so without this, two parallel
// requests with an expired access token would each fire a refresh and the
// second one would fail because its stored refresh token is now stale.
let refreshInflight: Promise<void> | null = null

async function doRefresh(): Promise<void> {
  const token = getRefreshToken()
  if (!token) throw new Error('No refresh token')
  const response = await apiClient.post<RefreshResponse>('/auth/refresh', {
    refresh_token: token,
  })
  setTokens(response.data.access_token, response.data.refresh_token)
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config
    if (!config || config._isRetry) {
      return Promise.reject(error)
    }
    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }
    // Don't recurse on auth endpoints themselves: /auth/refresh failure means
    // the refresh token is invalid, and /auth/login has no token to use.
    const url = config.url ?? ''
    if (url.includes('/auth/refresh') || url.includes('/auth/login')) {
      return Promise.reject(error)
    }

    if (!refreshInflight) {
      refreshInflight = doRefresh().finally(() => {
        refreshInflight = null
      })
    }

    try {
      await refreshInflight
      config._isRetry = true
      return apiClient(config)
    } catch {
      clearTokens()
      return Promise.reject(error)
    }
  },
)

export default apiClient