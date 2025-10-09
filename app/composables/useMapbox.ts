import mapboxgl from 'mapbox-gl'
import { STORE_LOCATION, TEST_DEFAULT_CENTER } from '~/constants'
import type { Map, LngLatLike, Marker } from 'mapbox-gl'

export interface MapboxOptions {
  container: string | HTMLElement
  center?: [number, number]
  zoom?: number
  style?: string
}

export const useMapbox = () => {
  const config = useRuntimeConfig()
  const mapInstance = ref<Map | null>(null)
  const userMarker = ref<Marker | null>(null)
  const centerMarker = ref<Marker | null>(null)
  const isMapReady = ref(false)

  // Crear instancia del mapa
  const createMap = (options: MapboxOptions): Map => {
    // Asegurar que el token esté configurado
    if (config.public.mapboxToken) {
      mapboxgl.accessToken = config.public.mapboxToken as string
      console.log('✅ Mapbox token set:', mapboxgl.accessToken.substring(0, 20) + '...')
    } else {
      throw new Error('Mapbox token not found in runtime config')
    }

    console.log('🗺️ Creating Mapbox map with options:', options)

    const defaultOptions = {
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [TEST_DEFAULT_CENTER.lng, TEST_DEFAULT_CENTER.lat] as [number, number],
      zoom: 15
    }

    const map = new mapboxgl.Map({
      ...defaultOptions,
      ...options,
      // Optimizaciones para móviles
      cooperativeGestures: false, // Desactivar gestos cooperativos para mejor UX móvil
      pitchWithRotate: false, // Desactivar pitch para mejor rendimiento
      dragRotate: false, // Desactivar rotación para mejor rendimiento
      touchPitch: false, // Desactivar pitch táctil
      renderWorldCopies: false, // No renderizar copias del mundo
      antialias: false, // Desactivar antialiasing para mejor rendimiento
      optimizeForTerrain: false, // Optimizar para terreno plano
      performanceMetricsCollection: false // Desactivar métricas de rendimiento
    })

    map.on('load', () => {
      isMapReady.value = true
      console.log('🗺️ Mapbox map loaded successfully')
    })

    mapInstance.value = map
    return map
  }

  // Agregar marcador
  const addMarker = (lngLat: LngLatLike, options?: mapboxgl.MarkerOptions): Marker => {
    if (!mapInstance.value) {
      throw new Error('Map instance not initialized')
    }

    const marker = new mapboxgl.Marker(options)
      .setLngLat(lngLat)
      .addTo(mapInstance.value)

    return marker
  }

  // Centrar mapa en coordenadas
  const centerMap = (lngLat: [number, number], zoom?: number) => {
    if (!mapInstance.value) return

    mapInstance.value.flyTo({
      center: lngLat,
      zoom: zoom || mapInstance.value.getZoom(),
      essential: true
    })
  }

  // Obtener centro actual del mapa
  const getMapCenter = (): [number, number] | null => {
    if (!mapInstance.value) return null
    const center = mapInstance.value.getCenter()
    return [center.lng, center.lat]
  }

  // Limpiar mapa
  const cleanup = () => {
    if (userMarker.value) {
      userMarker.value.remove()
      userMarker.value = null
    }
    if (centerMarker.value) {
      centerMarker.value.remove()
      centerMarker.value = null
    }
    if (mapInstance.value) {
      mapInstance.value.remove()
      mapInstance.value = null
    }
    isMapReady.value = false
    console.log('🧹 Mapbox cleanup completed')
  }

  return {
    mapInstance: readonly(mapInstance),
    userMarker,
    centerMarker,
    isMapReady: readonly(isMapReady),
    createMap,
    addMarker,
    centerMap,
    getMapCenter,
    cleanup,
    STORE_LOCATION,
    TEST_DEFAULT_CENTER
  }
}
