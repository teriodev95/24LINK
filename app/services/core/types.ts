import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

// Core API configuration interface
export interface ApiConfig {
  baseURL: string
  apiKey?: string
  authToken?: string
  headers?: Record<string, string>
  timeout?: number
}

// Interceptor configuration
export interface InterceptorConfig {
  request?: {
    onFulfilled?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
    onRejected?: (error: unknown) => unknown
  }
  response?: {
    onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
    onRejected?: (error: unknown) => unknown
  }
}

// Predefined API configurations
export interface ApiConfigurations {
  supa: ApiConfig
}

// Service factory function type
export type ServiceFactory<T = unknown> = () => T

// Service registry interface
export interface IServiceRegistry {
  register<T>(name: string, factory: ServiceFactory<T>): void
  get<T>(name: string): T | null
  getAll(): Record<string, unknown>
  has(name: string): boolean
  unregister(name: string): boolean
}

// API client factory interface
export interface IApiClientFactory {
  create(config: ApiConfig): AxiosInstance
  createFromPreset(preset: keyof ApiConfigurations): AxiosInstance
}