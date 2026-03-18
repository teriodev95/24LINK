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
    lat: 19.702432,
    lng: -101.192755
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
    if (userLocation.value.lat && userLocation.value.lng && isLocationLoaded.value) {
      return [userLocation.value.lat, userLocation.value.lng]
    }
    if (markerPosition.value.lat && markerPosition.value.lng) {
      return [markerPosition.value.lat, markerPosition.value.lng]
    }
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
      markerPosition.value = {
        lat: newLocation.lat,
        lng: newLocation.lng
      }
      isLocationLoaded.value = true
    }
  }, { immediate: true })

  // Si el GPS falla pero hay permisos, abrir el mapa con ubicación por defecto
  watch(geoLocationError, (error) => {
    if (error && !isLocationLoaded.value) {
      markerPosition.value = { ...defaultLocation }
      isLocationLoaded.value = true
    }
  })

  // Función para obtener posición (wrapper del composable de geolocalización)
  const getUserPosition = async (): Promise<void> => {
    await geoGetUserLocation()
  }

  const onMapMove = (event: { target: { getCenter: () => Position } }): void => {
    const { lat, lng } = event.target.getCenter()
    markerPosition.value = { lat, lng }
  }

  const resetLocation = () => {

    // Resetear el estado del composable de geolocalización
    geoResetState()

    // Resetear estados específicos del mapa
    markerPosition.value = { lat: 0, lng: 0 }
    isLocationLoaded.value = false
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