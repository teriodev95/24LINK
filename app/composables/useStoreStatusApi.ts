interface StoreStatusResponse {
  abierto: boolean
  ultimaActualizacion: string
}

export function useStoreStatusApi() {
  const { data, error, refresh } = useFetch<{ success: boolean; data: StoreStatusResponse }>('https://control-local-24link.clvrt.workers.dev/estado', {
    key: 'store-status',
    default: () => ({ success: true, data: { abierto: true, ultimaActualizacion: '' } }),
    server: false, // Solo ejecutar en el cliente para evitar hydratación
  })


  const isStoreOpen = computed(() => {
    if (error.value) {
      console.error('❌ Error al consultar estado de la tienda:', error.value)
      return true // En caso de error, asumimos que está abierto
    }
    console.log('✅ Estado de la tienda:', data.value)
    return data.value?.data?.abierto ?? true
  })

  return {
    isStoreOpen: readonly(isStoreOpen),
    refresh
  }
}