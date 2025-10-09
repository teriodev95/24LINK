import type { Address } from '~/interfaces'

interface AddressesState {
  addresses: Address[]
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

export const useAddressesStore = defineStore('addresses', () => {
  const state = reactive<AddressesState>({
    addresses: [],
    isLoading: false,
    error: null,
    isInitialized: false
  })

  const { loadUserAddresses } = useUserAddresses()
  const { userId } = useAuth()

  const addresses = computed(() => state.addresses)
  const isLoading = computed(() => state.isLoading)
  const error = computed(() => state.error)
  const hasAddresses = computed(() => state.addresses.length > 0)

  const loadAddresses = async (force = false) => {
    if (!userId.value) {
      console.warn('No hay usuario autenticado')
      state.addresses = []
      state.isInitialized = false
      return
    }

    if (state.isInitialized && !force) {
      console.log('Direcciones ya cargadas, usando cache')
      return
    }

    state.isLoading = true
    state.error = null

    try {
      const result = await loadUserAddresses()
      state.addresses = result
      state.isInitialized = true
      console.log('✅ Direcciones cargadas en store:', state.addresses.length)
    } catch (err: any) {
      console.error('Error loading addresses in store:', err)
      state.error = err?.message || 'Error al cargar direcciones'
      state.addresses = []
    } finally {
      state.isLoading = false
    }
  }

  const addAddress = (address: Address) => {
    state.addresses.unshift(address)
  }

  const updateAddress = (id: string, updatedAddress: Partial<Address>) => {
    const index = state.addresses.findIndex(addr => addr.id === id)
    if (index !== -1) {
      state.addresses[index] = { ...state.addresses[index], ...updatedAddress }
    }
  }

  const removeAddress = (id: string) => {
    const index = state.addresses.findIndex(addr => addr.id === id)
    if (index !== -1) {
      state.addresses.splice(index, 1)
    }
  }

  const clearAddresses = () => {
    state.addresses = []
    state.isInitialized = false
    state.error = null
  }

  const refreshAddresses = () => {
    return loadAddresses(true)
  }

  watch(userId, (newUserId) => {
    if (newUserId) {
      loadAddresses()
    } else {
      clearAddresses()
    }
  })

  return {
    addresses,
    isLoading,
    error,
    hasAddresses,
    loadAddresses,
    addAddress,
    updateAddress,
    removeAddress,
    clearAddresses,
    refreshAddresses
  }
})