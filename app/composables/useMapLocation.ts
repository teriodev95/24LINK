import useGeolocation from '~/composables/useGeolocation'
import { TEST_DEFAULT_CENTER, STORE_LOCATION } from '~/constants'

export interface Position {
  lat: number
  lng: number
}

export const useMapLocation = () => {
  console.log('🗺️ Inicializando useMapLocation con Mapbox...')

  // Usar el composable de geolocalización
  const {
    userLocation: geoUserLocation,
    locationError: geoLocationError,
    isLoading: geoIsLoading,
    hasPermission: geoHasPermission,
    resetGeolocationState: geoResetState
  } = useGeolocation()

  // Estados específicos del mapa
  const markerPosition = ref<Position>({ lat: 0, lng: 0 })
  const isLocationLoaded = ref(false)

  // Convertir LatLng a Position
  const userLocation = computed((): Position => {
    if (geoUserLocation.value) {
      console.log('📍 Convirtiendo ubicación de LatLng a Position:', geoUserLocation.value)
      return {
        lat: geoUserLocation.value.lat,
        lng: geoUserLocation.value.lng
      }
    }
    console.log('🧪 Usando ubicación de prueba por defecto:', TEST_DEFAULT_CENTER)
    return TEST_DEFAULT_CENTER
  })

  // Estados reactivos del composable de geolocalización
  const isLoadingLocation = computed(() => geoIsLoading.value)
  const locationError = computed(() => geoLocationError.value)
  const hasPermission = computed(() => geoHasPermission.value)

  const mapCenter = computed((): [number, number] => {
    console.log('🎯 Calculando centro del mapa...')
    console.log('🔍 Estados:', {
      userLocation: userLocation.value,
      markerPosition: markerPosition.value,
      isLocationLoaded: isLocationLoaded.value
    })

    if (userLocation.value.lat && userLocation.value.lng && isLocationLoaded.value) {
      console.log('✅ Usando ubicación del usuario:', [userLocation.value.lng, userLocation.value.lat])
      return [userLocation.value.lng, userLocation.value.lat]
    }
    if (markerPosition.value.lat && markerPosition.value.lng) {
      console.log('📌 Usando posición del marcador:', [markerPosition.value.lng, markerPosition.value.lat])
      return [markerPosition.value.lng, markerPosition.value.lat]
    }
    console.log('🧪 Usando centro de prueba por defecto:', [TEST_DEFAULT_CENTER.lng, TEST_DEFAULT_CENTER.lat])
    return [TEST_DEFAULT_CENTER.lng, TEST_DEFAULT_CENTER.lat]
  })

  const tooltipContent = computed(() => {
    const lat = markerPosition.value.lat?.toFixed(6) || '0'
    const lng = markerPosition.value.lng?.toFixed(6) || '0'
    return `Lat: ${lat}, Lng: ${lng}`
  })

  // Watcher para sincronizar ubicación del usuario con marcador cuando se obtiene
  watch(geoUserLocation, (newLocation) => {
    if (newLocation) {
      console.log('👀 Ubicación del usuario actualizada, sincronizando marcador...')
      markerPosition.value = {
        lat: newLocation.lat,
        lng: newLocation.lng
      }
      isLocationLoaded.value = true
      console.log('✅ Marcador sincronizado con ubicación del usuario:', markerPosition.value)
    } else {
      // Si no hay ubicación del usuario, usar la de prueba
      console.log('🧪 No hay ubicación del usuario, usando centro de prueba')
      markerPosition.value = {
        lat: TEST_DEFAULT_CENTER.lat,
        lng: TEST_DEFAULT_CENTER.lng
      }
      isLocationLoaded.value = true
    }
  }, { immediate: true })

  // Función para obtener posición (wrapper del composable de geolocalización)
  const getUserPosition = async (): Promise<void> => {
    console.log('🗺️ useMapLocation: Iniciando obtención de ubicación...')

    // MODO DESARROLLO: Siempre usar ubicación de prueba
    // TODO: Cambiar a geoGetUserLocation() en producción
    console.log('🧪 MODO DESARROLLO: Usando ubicación de prueba fija')
    markerPosition.value = {
      lat: TEST_DEFAULT_CENTER.lat,
      lng: TEST_DEFAULT_CENTER.lng
    }
    isLocationLoaded.value = true

    // PRODUCCIÓN: Descomentar para usar geolocalización real
    // await geoGetUserLocation()
    // if (!geoUserLocation.value) {
    //   console.log('🧪 useMapLocation: No se obtuvo ubicación, usando centro de prueba')
    //   markerPosition.value = {
    //     lat: TEST_DEFAULT_CENTER.lat,
    //     lng: TEST_DEFAULT_CENTER.lng
    //   }
    //   isLocationLoaded.value = true
    // }

    console.log('📍 useMapLocation: Proceso de geolocalización completado')
    console.log('📊 Estados actuales:', {
      geoUserLocation: geoUserLocation.value,
      userLocation: userLocation.value,
      markerPosition: markerPosition.value,
      isLocationLoaded: isLocationLoaded.value,
      isLoadingLocation: isLoadingLocation.value,
      locationError: locationError.value,
      hasPermission: hasPermission.value
    })
  }

  const updateMarkerPosition = (position: Position): void => {
    console.log('🗺️ Actualizando posición del marcador:', position)
    markerPosition.value = position
  }

  const resetLocation = () => {
    console.log('🔄 useMapLocation: Reseteando estado de ubicación...')

    // Resetear el estado del composable de geolocalización
    geoResetState()

    // Resetear estados específicos del mapa
    markerPosition.value = { lat: 0, lng: 0 }
    isLocationLoaded.value = false

    console.log('✅ useMapLocation: Estado de ubicación reseteado completamente')
  }

  return {
    userLocation: readonly(userLocation),
    markerPosition: readonly(markerPosition),
    mapCenter,
    tooltipContent,
    isLocationLoaded: readonly(isLocationLoaded),
    isLoadingLocation: readonly(isLoadingLocation),
    locationError: readonly(locationError),
    hasPermission: readonly(hasPermission),
    getUserPosition,
    updateMarkerPosition,
    resetLocation,
    STORE_LOCATION,
    TEST_DEFAULT_CENTER
  }
}
