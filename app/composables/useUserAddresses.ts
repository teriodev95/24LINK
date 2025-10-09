import type { Address } from '~/interfaces'

interface DireccionDB {
  id: string
  calle: string
  numero_exterior: string
  numero_interior?: string
  colonia: string
  referencias?: string
}

export function useUserAddresses() {
  const { $fetch: supabaseFetch } = useSupabaseApi()
  const { userId } = useAuth()

  const addresses = ref<Address[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadAddresses = async () => {
    if (!userId.value) {
      console.warn('No hay usuario autenticado')
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await supabaseFetch<DireccionDB[]>(
        `/direcciones?usuario_id=eq.${userId.value}&select=id,calle,numero_exterior,numero_interior,colonia,referencias&order=created_at.desc`
      )

      console.log('Cargando direcciones para usuario:', result)

      if (result && Array.isArray(result)) {
        addresses.value = result.map(dir => ({
          id: dir.id,
          street: `${dir.calle} ${dir.numero_exterior}${dir.numero_interior ? ' ' + dir.numero_interior : ''}`,
          colony: dir.colonia,
          reference: dir.referencias
        }))

        console.log('✅ Direcciones cargadas:', addresses.value.length)
      }
    } catch (err: any) {
      console.error('Error loading addresses:', err)
      error.value = err?.message || 'Error al cargar direcciones'
      addresses.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Auto-cargar direcciones cuando cambie el userId
  watch(userId, (newUserId) => {
    if (newUserId) {
      loadAddresses()
    } else {
      addresses.value = []
    }
  }, { immediate: true })

  return {
    addresses: readonly(addresses),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadAddresses
  }
}
