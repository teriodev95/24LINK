import axios, { type AxiosInstance } from 'axios'
import type { ApiConfig, InterceptorConfig, IApiClientFactory, ApiConfigurations } from './types'
import {
  contentTypeInterceptor,
  authInterceptor,
  supabaseInterceptor,
  loggingInterceptor,
  errorHandlerInterceptor
} from './interceptors'

// Predefined API configurations based on current implementation
export const API_CONFIGURATIONS: ApiConfigurations = {
  supa: {
    baseURL: 'https://db.el24.cc/rest/v1',
    timeout: 10000,
    apiKey: import.meta.env.VITE_SUPABASE_API_KEY,
    authToken: import.meta.env.VITE_SUPABASE_AUTH_TOKEN
  },
}

class ApiClientFactory implements IApiClientFactory {
  create(config: ApiConfig): AxiosInstance {
    return ApiClientFactory.create(config)
  }

  createFromPreset(preset: keyof ApiConfigurations): AxiosInstance {
    return ApiClientFactory.createFromPreset(preset)
  }

  private static applyInterceptors(instance: AxiosInstance, interceptors: InterceptorConfig[]): void {
    interceptors.forEach(interceptor => {
      if (interceptor.request) {
        instance.interceptors.request.use(
          interceptor.request.onFulfilled,
          interceptor.request.onRejected
        )
      }

      if (interceptor.response) {
        instance.interceptors.response.use(
          interceptor.response.onFulfilled,
          interceptor.response.onRejected
        )
      }
    })
  }

  static create(config: ApiConfig): AxiosInstance {
    const axiosConfig = {
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: config.headers || {}
    }

    const instance = axios.create(axiosConfig)

    // Default interceptors for all instances
    const interceptors: InterceptorConfig[] = [
      contentTypeInterceptor,
      errorHandlerInterceptor
    ]

    // Add development logging in dev mode
    if (import.meta.env.DEV) {
      interceptors.push(loggingInterceptor)
    }

    // Add Supabase interceptor if both apiKey and authToken are provided
    if (config.apiKey && config.authToken) {
      interceptors.push(supabaseInterceptor(config.apiKey, config.authToken))
    } else if (config.apiKey) {
      // Fallback to auth interceptor for other APIs
      interceptors.push(authInterceptor(config.apiKey))
    }

    this.applyInterceptors(instance, interceptors)

    return instance
  }

  static createFromPreset(preset: keyof ApiConfigurations): AxiosInstance {
    const config = API_CONFIGURATIONS[preset]
    if (!config) {
      throw new Error(`Unknown API preset: ${preset}`)
    }
    return this.create(config)
  }
}

// Export factory functions for convenience
export const createApiClient = (config: ApiConfig): AxiosInstance =>
  ApiClientFactory.create(config)

export const createApiClientFromPreset = (preset: keyof ApiConfigurations): AxiosInstance =>
  ApiClientFactory.createFromPreset(preset)

export { ApiClientFactory }