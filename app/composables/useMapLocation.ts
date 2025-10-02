export interface Position {
  lat: number
  lng: number
}

interface TileProvider {
  url: string
  attribution: string
}

export const useMapLocation = () => {
  const userLocation = ref<Position>({ lat: 0, lng: 0 })
  const markerPosition = ref<Position>({ lat: 0, lng: 0 })
  const zoom = ref(20)
  const isLocationLoaded = ref(false)
  const isLoadingLocation = ref(false)

  const defaultLocation: Position = {
    lat: 19.4326, // Mexico City as default
    lng: -99.1332
  }

  const tileProvider: TileProvider = {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }

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

  const getUserPosition = async (): Promise<void> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser.')
        isLoadingLocation.value = false
        isLocationLoaded.value = true
        resolve()
        return
      }

      isLoadingLocation.value = true

      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation.value = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }

          markerPosition.value = { ...userLocation.value }

          isLocationLoaded.value = true
          isLoadingLocation.value = false
          resolve()
        },
        (error) => {
          console.warn('Error getting user location:', error)
          isLocationLoaded.value = true
          isLoadingLocation.value = false
          resolve()
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  const onMapMove = (event: { target: { getCenter: () => Position } }): void => {
    const { lat, lng } = event.target.getCenter()
    markerPosition.value = { lat, lng }
  }

  const resetLocation = () => {
    userLocation.value = { lat: 0, lng: 0 }
    markerPosition.value = { lat: 0, lng: 0 }
    isLocationLoaded.value = false
    isLoadingLocation.value = false
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
    getUserPosition,
    onMapMove,
    resetLocation
  }
}