import useGeolocation from '~/composables/useGeolocation'

export interface Position {
  lat: number
  lng: number
}

interface TileProvider {
  url: string
  attribution: string
}

export const useMapLocation = () => {
  console.log('🗺️ Inicializando useMapLocation...')

  // Usar el composable de geolocalización
  const {
    userLocation: geoUserLocation,
    locationError: geoLocationError,
    isLoading: geoIsLoading,
    hasPermission: geoHasPermission,
    getUserLocation: geoGetUserLocation,
    resetGeolocationState: geoResetState
  } = useGeolocation()

  // Estados específicos del mapa
  const markerPosition = ref<Position>({ lat: 0, lng: 0 })
  const zoom = ref(20)
  const isLocationLoaded = ref(false)

  const defaultLocation: Position = {
    lat: 19.4326, // Mexico City as default
    lng: -99.1332
  }

  const tileProvider: TileProvider = {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }

  // Convertir LatLng a Position
  const userLocation = computed((): Position => {
    if (geoUserLocation.value) {
      console.log('📍 Convirtiendo ubicación de LatLng a Position:', geoUserLocation.value)
      return {
        lat: geoUserLocation.value.lat,
        lng: geoUserLocation.value.lng
      }
    }
    console.log('🏙️ Usando ubicación por defecto:', defaultLocation)
    return defaultLocation
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
      console.log('✅ Usando ubicación del usuario:', [userLocation.value.lat, userLocation.value.lng])
      return [userLocation.value.lat, userLocation.value.lng]
    }
    if (markerPosition.value.lat && markerPosition.value.lng) {
      console.log('📌 Usando posición del marcador:', [markerPosition.value.lat, markerPosition.value.lng])
      return [markerPosition.value.lat, markerPosition.value.lng]
    }
    console.log('🏙️ Usando ubicación por defecto:', [defaultLocation.lat, defaultLocation.lng])
    return [defaultLocation.lat, defaultLocation.lng]
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
    }
  }, { immediate: true })

  // Función para obtener posición (wrapper del composable de geolocalización)
  const getUserPosition = async (): Promise<void> => {
    console.log('🗺️ useMapLocation: Iniciando obtención de ubicación...')

    // Llamar al método del composable de geolocalización
    await geoGetUserLocation()

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

  const onMapMove = (event: { target: { getCenter: () => Position } }): void => {
    const { lat, lng } = event.target.getCenter()
    console.log('🗺️ Mapa movido, nueva posición del marcador:', { lat, lng })
    markerPosition.value = { lat, lng }
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
    zoom,
    tileProvider,
    mapCenter,
    tooltipContent,
    isLocationLoaded: readonly(isLocationLoaded),
    isLoadingLocation: readonly(isLoadingLocation),
    locationError: readonly(locationError),
    hasPermission: readonly(hasPermission),
    getUserPosition,
    onMapMove,
    resetLocation
  }
}