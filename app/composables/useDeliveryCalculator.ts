import { STORE_LOCATION } from '~/constants'

interface DeliveryCalculation {
  distance: number // metros
  duration: number // segundos
  cost: number // MXN
  distanceKm: string // formateado
  durationMin: string // formateado
}

export function useDeliveryCalculator() {
  const config = useRuntimeConfig()
  const { $fetch: supabaseFetch } = useSupabaseApi()
  const orderStore = useOrderStore()

  const isCalculating = ref(false)
  const calculationError = ref<string | null>(null)

  /**
   * Calcula la ruta y costo de envío basado en coordenadas de dirección
   */
  const calculateDeliveryFromAddress = async (addressId: string): Promise<DeliveryCalculation | null> => {
    isCalculating.value = true
    calculationError.value = null

    try {
      console.log('📍 Calculando ruta para dirección:', addressId)

      // 1. Obtener coordenadas de la dirección desde la BD
      const addressData = await supabaseFetch<Array<{
        latitud: number
        longitud: number
      }>>(`/direcciones?id=eq.${addressId}&select=latitud,longitud`)

      if (!addressData || addressData.length === 0) {
        throw new Error('No se encontraron coordenadas para esta dirección')
      }

      const address = addressData[0]!

      // Validar coordenadas
      if (!address.latitud || !address.longitud) {
        throw new Error('La dirección no tiene coordenadas válidas')
      }

      // 2. Calcular ruta usando Mapbox Directions API
      const result = await calculateDeliveryFromCoordinates(address.latitud, address.longitud)

      if (result) {
        // 3. Actualizar el orderStore con los datos calculados
        orderStore.setDeliveryLocation({
          lat: address.latitud,
          lng: address.longitud
        })
        orderStore.setDeliveryCost(result.cost)
        orderStore.setDeliveryDistance(result.distance)

        // 4. Los totales del carrito se actualizarán automáticamente cuando sea necesario
        // ya que updateCartTotals() verifica si hay una dirección válida

        console.log('✅ Cálculo completado:', result)
      }

      return result
    } catch (error: unknown) {
      console.error('❌ Error calculando envío:', error)
      calculationError.value = (error as Error)?.message || 'Error al calcular el costo de envío'
      return null
    } finally {
      isCalculating.value = false
    }
  }

  /**
   * Calcula la ruta y costo basado en coordenadas directas
   */
  const calculateDeliveryFromCoordinates = async (lat: number, lng: number): Promise<DeliveryCalculation | null> => {
    try {
      const origin = [STORE_LOCATION.lng, STORE_LOCATION.lat]
      const destination = [lng, lat]
      const coords = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`

      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&access_token=${config.public.mapboxToken}`

      console.log('🛣️ Llamando a Mapbox Directions API...')

      const response = await fetch(url)
      const data = await response.json()

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('No se pudo calcular la ruta')
      }

      const route = data.routes[0]
      const distance = route.distance // metros
      const duration = route.duration // segundos

      // Calcular costo usando la función del sistema
      const costData = calculateDeliveryCost(distance, duration)

      return {
        distance,
        duration,
        cost: Math.round(costData.totalCost),
        distanceKm: `${(distance / 1000).toFixed(2)} km`,
        durationMin: `${Math.round(duration / 60)} min`
      }
    } catch (error) {
      console.error('❌ Error en cálculo de ruta:', error)
      throw error
    }
  }

  /**
   * Recalcula el costo cuando cambia la dirección seleccionada
   */
  const recalculateOnAddressChange = async (addressId: string) => {
    console.log('🔄 Recalculando costo para nueva dirección...')
    return await calculateDeliveryFromAddress(addressId)
  }

  return {
    calculateDeliveryFromAddress,
    calculateDeliveryFromCoordinates,
    recalculateOnAddressChange,
    isCalculating: readonly(isCalculating),
    calculationError: readonly(calculationError)
  }
}
