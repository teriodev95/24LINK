interface SaveAddressData {
  calle: string
  numero_exterior: string
  colonia: string
  referencias?: string
  latitud: number
  longitud: number
}

export function useSaveAddress() {
  const { $fetch: supabaseFetch } = useSupabaseApi()
  const { userId } = useAuth()
  const orderStore = useOrderStore()

  const isSaving = ref(false)
  const error = ref<string | null>(null)

  const saveAddress = async (data: SaveAddressData) => {
    if (!userId.value) {
      throw new Error('No hay usuario autenticado')
    }

    isSaving.value = true
    error.value = null

    try {
      console.log('💾 Guardando dirección en BD:', data)

      const newAddressResult = await supabaseFetch<Array<{
        id: string
        calle: string
        numero_exterior: string
        numero_interior?: string
        colonia: string
        referencias?: string
      }>>('/direcciones', {
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

      if (!newAddressResult || newAddressResult.length === 0) {
        throw new Error('No se pudo guardar la dirección')
      }

      const savedAddress = newAddressResult[0]!

      console.log('✅ Dirección guardada:', savedAddress)

      // Formatear dirección para el orderStore
      const formattedAddress = {
        id: savedAddress.id,
        street: `${savedAddress.calle} ${savedAddress.numero_exterior}${savedAddress.numero_interior ? ' ' + savedAddress.numero_interior : ''}`,
        colony: savedAddress.colonia,
        reference: savedAddress.referencias
      }

      // Agregar al orderStore para que aparezca inmediatamente
      orderStore.setAddressList([
        formattedAddress,
        ...orderStore.addressList
      ])

      // Seleccionar la nueva dirección
      orderStore.setSelectedAddress(formattedAddress)

      return {
        success: true,
        address: formattedAddress
      }
    } catch (err: any) {
      console.error('❌ Error guardando dirección:', err)
      error.value = err?.message || 'Error al guardar la dirección'

      return {
        success: false,
        error: error.value
      }
    } finally {
      isSaving.value = false
    }
  }

  return {
    saveAddress,
    isSaving: readonly(isSaving),
    error: readonly(error)
  }
}
