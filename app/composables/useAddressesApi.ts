import type { Address, SupabaseAdress, SaveAddressData } from '~/interfaces'

export function useAddresses() {
  const { $fetch: supabaseFetch } = useSupabaseApi()
  const { userId } = useAuth()

  // State
  const addresses = ref<Address[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const hasAddresses = computed(() => addresses.value.length > 0)
  const isReady = computed(() => !isLoading.value && !error.value)

  // Helper function to format address from DB to UI
  const formatAddress = (dir: SupabaseAdress): Address => ({
    id: dir.id,
    street: `${dir.calle} #${dir.numero_exterior} ${dir.numero_interior ? ' ' + dir.numero_interior : ''}`,
    colony: dir.colonia,
    reference: dir.referencias
  })

  // Load addresses from database
  const loadAddresses = async (): Promise<void> => {
    if (!userId.value) { 
      console.warn('No hay usuario autenticado')
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await supabaseFetch<SupabaseAdress[]>(
        `/direcciones?usuario_id=eq.${userId.value}&select=id,calle,numero_exterior,numero_interior,colonia,referencias&order=created_at.desc`
      )

      if (result && result.length > 0) {
        addresses.value = result.map(formatAddress)
        console.log('✅ Direcciones cargadas:', addresses.value.length)
      }
    } catch (err: unknown) {
      console.error('Error loading addresses:', err)
      error.value = (err as Error)?.message || 'Error al cargar direcciones'
      addresses.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Save new address to database
  const saveAddress = async (data: SaveAddressData) => {
    if (!userId.value) {
      const errorMsg = 'No hay usuario autenticado'
      error.value = errorMsg
      throw new Error(errorMsg)
    }

    isSaving.value = true
    error.value = null

    try {
      console.log('💾 Guardando dirección en BD:', data)

      await supabaseFetch<SupabaseAdress[]>('/direcciones', {
        method: 'POST',
        body: {
          usuario_id: userId.value,
          nombre: 'Mi dirección',
          calle: data.calle,
          numero_exterior: data.numero_exterior,
          colonia: data.colonia,
          codigo_postal: '00000',
          latitud: data.latitud,
          longitud: data.longitud,
          referencias: data.referencias || '',
          es_predeterminada: false
        },
        additionalHeaders: {
          'Prefer': 'return=representation'
        }
      })

      console.log('✅ Dirección guardada exitosamente')
    } catch (err: unknown) {
      console.error('❌ Error guardando dirección:', err)
      const errorMsg = (err as Error)?.message || 'Error al guardar la dirección'
      error.value = errorMsg
      throw new Error(errorMsg)
    } finally {
      isSaving.value = false
    }
  }

  const clearAddresses = (): void => {
    addresses.value = []
  }

  const refreshAddresses = async (): Promise<void> => {
    await loadAddresses()
  }

  // Auto-load addresses when userId changes
  watch(userId, (newUserId) => {
    if (newUserId) {
      loadAddresses()
    } else {
      clearAddresses()
    }
  }, { immediate: true })

  return {
    // State (readonly)
    addresses,
    isLoading: readonly(isLoading),
    isSaving: readonly(isSaving),
    error: readonly(error),

    // Computed
    hasAddresses,
    isReady,

    // Actions
    loadAddresses,
    saveAddress,
    clearAddresses,
    refreshAddresses
  }
}