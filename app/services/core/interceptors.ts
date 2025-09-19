import type { InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios'
import type { InterceptorConfig } from './types'

// Default content-type interceptor (same as current implementation)
export const contentTypeInterceptor: InterceptorConfig = {
  request: {
    onFulfilled: (config: InternalAxiosRequestConfig) => {
      if (!(config.headers as AxiosRequestHeaders)['Content-Type']) {
        ;(config.headers as AxiosRequestHeaders)['Content-Type'] = 'application/json'
      }
      return config
    }
  }
}

// API Key interceptor for FastAPI
export const apiKeyInterceptor = (apiKey: string): InterceptorConfig => ({
  request: {
    onFulfilled: (config: InternalAxiosRequestConfig) => {
      if (config.method?.toLowerCase() === 'post') {
        ;(config.headers as AxiosRequestHeaders)['X-API-Key'] = apiKey
      }
      return config
    }
  }
})

// Authorization header interceptor
export const authInterceptor = (token: string): InterceptorConfig => ({
  request: {
    onFulfilled: (config: InternalAxiosRequestConfig) => {
      ;(config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${token}`
      return config
    }
  }
})

// Supabase interceptor - adds both apikey and Authorization headers
export const supabaseInterceptor = (apiKey: string, authToken: string): InterceptorConfig => ({
  request: {
    onFulfilled: (config: InternalAxiosRequestConfig) => {
      const headers = config.headers as AxiosRequestHeaders
      headers['apikey'] = apiKey
      headers['Authorization'] = `Bearer ${authToken}`
      return config
    }
  }
})

// Request logging interceptor (for development)
export const loggingInterceptor: InterceptorConfig = {
  request: {
    onFulfilled: (config: InternalAxiosRequestConfig) => {
      if (import.meta.env.DEV) {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data)
      }
      return config
    }
  },
  response: {
    onFulfilled: (response) => {
      if (import.meta.env.DEV) {
        console.log(`[API Response] ${response.status} ${response.config.url}`, response.data)
      }
      return response
    },
    onRejected: (error) => {
      if (import.meta.env.DEV) {
        console.error(`[API Error] ${error.config?.url}`, error)
      }
      return Promise.reject(error)
    }
  }
}

// Error handling interceptor
export const errorHandlerInterceptor: InterceptorConfig = {
  response: {
    onRejected: (error) => {
      // Add standardized error handling logic here
      if (error.response?.status === 401) {
        // Handle unauthorized - could redirect to login
        console.warn('Unauthorized access detected')
      }

      if (error.response?.status >= 500) {
        // Handle server errors
        console.error('Server error detected:', error.response.status)
      }

      return Promise.reject(error)
    }
  }
}