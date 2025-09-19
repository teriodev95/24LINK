export interface SupabaseApiOptions {
  key?: string
  lazy?: boolean
  additionalHeaders?: Record<string, string>
}

export function useSupabaseApi() {
  const config = useRuntimeConfig()

  // Headers por defecto para Supabase
  const getHeaders = (additionalHeaders: Record<string, string> = {}) => ({
    'apikey': config.public.supabaseApiKey,
    'Authorization': `Bearer ${config.supabaseAuthToken || config.public.supabaseApiKey}`,
    'Content-Type': 'application/json',
    ...additionalHeaders
  })

  // useFetch wrapper con configuración de Supabase
  async function fetch<T = unknown>(
    url: string,
    options: SupabaseApiOptions = {}
  ) {
    const { additionalHeaders, ...fetchOptions } = options

    return useFetch<T>(url, {
      baseURL: 'https://db.el24.cc/rest/v1',
      headers: getHeaders(additionalHeaders),
      key: options.key || `supabase-${url}`,
      ...fetchOptions
    })
  }

  // useLazyFetch wrapper
  async function fetchLazy<T = unknown>(
    url: string,
    options: SupabaseApiOptions = {}
  ) {
    return fetch<T>(url, { ...options, lazy: true })
  }

  // $fetch wrapper para operaciones client-side
  async function $api<T = unknown>(
    url: string,
    options: {
      method?: string
      body?: Record<string, unknown> | string | null
      additionalHeaders?: Record<string, string>
      query?: Record<string, unknown>
    } = {}
  ): Promise<T> {
    const { additionalHeaders, method = 'GET', body, query } = options

    return $fetch<T>(url, {
      baseURL: 'https://db.el24.cc/rest/v1',
      method: method as 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE',
      headers: getHeaders(additionalHeaders),
      body,
      query
    })
  }

  return {
    fetch,
    fetchLazy,
    $fetch: $api,
    // También exportamos los headers por si se necesitan en algún otro lado
    getHeaders
  }
}

export type SupabaseApi = ReturnType<typeof useSupabaseApi>