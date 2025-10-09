import type { Map } from 'mapbox-gl'
import { STORE_LOCATION } from '~/constants'

export interface DirectionsRoute {
  distance: number // en metros
  duration: number // en segundos
  geometry: {
    coordinates: [number, number][]
  }
}

export interface DirectionsResponse {
  routes: DirectionsRoute[]
  code: string
}

export const useMapboxDirections = () => {
  const config = useRuntimeConfig()
  const route = ref<DirectionsRoute | null>(null)
  const isLoadingRoute = ref(false)
  const routeError = ref<string | null>(null)

  // Cache para evitar llamadas duplicadas a la API
  const routeCache = new Map<string, DirectionsRoute>()
  const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutos
  const cacheTimestamps = new Map<string, number>()

  // Obtener ruta desde la tienda hasta el destino con cache
  const getRoute = async (destination: [number, number]): Promise<DirectionsRoute | null> => {
    const origin = [STORE_LOCATION.lng, STORE_LOCATION.lat]
    const cacheKey = `${origin[0]},${origin[1]};${destination[0].toFixed(4)},${destination[1].toFixed(4)}`

    // Verificar cache
    const cachedRoute = routeCache.get(cacheKey)
    const cacheTime = cacheTimestamps.get(cacheKey)

    if (cachedRoute && cacheTime && (Date.now() - cacheTime) < CACHE_EXPIRY) {
      console.log('💾 Using cached route')
      route.value = cachedRoute
      return cachedRoute
    }

    // Evitar múltiples llamadas simultáneas
    if (isLoadingRoute.value) {
      console.log('⏳ Route request already in progress, skipping...')
      return route.value
    }

    isLoadingRoute.value = true
    routeError.value = null

    try {
      const coords = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&access_token=${config.public.mapboxToken}`

      console.log('🛣️ Fetching route from Mapbox Directions API...')

      const response = await fetch(url)
      const data: DirectionsResponse = await response.json()

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('No se pudo calcular la ruta')
      }

      route.value = data.routes[0]

      // Guardar en cache
      routeCache.set(cacheKey, route.value)
      cacheTimestamps.set(cacheKey, Date.now())

      // Limpiar cache antiguo (mantener máximo 20 entradas)
      if (routeCache.size > 20) {
        const oldestKey = routeCache.keys().next().value
        routeCache.delete(oldestKey)
        cacheTimestamps.delete(oldestKey)
      }

      console.log('✅ Route calculated and cached:', {
        distance: `${(route.value.distance / 1000).toFixed(2)} km`,
        duration: `${Math.round(route.value.duration / 60)} min`
      })

      return route.value
    } catch (error) {
      console.error('❌ Error fetching route:', error)
      routeError.value = error instanceof Error ? error.message : 'Error al calcular la ruta'
      return null
    } finally {
      isLoadingRoute.value = false
    }
  }

  // Dibujar ruta en el mapa
  const drawRoute = (map: Map, routeData: DirectionsRoute) => {
    if (!map || !routeData) return

    // Remover capa y fuente existente si existe
    if (map.getLayer('route')) {
      map.removeLayer('route')
    }
    if (map.getSource('route')) {
      map.removeSource('route')
    }

    // Agregar fuente de datos de la ruta
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeData.geometry.coordinates
        }
      }
    })

    // Agregar capa de línea para visualizar la ruta
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3b82f6', // Azul
        'line-width': 5,
        'line-opacity': 0.75
      }
    })

    console.log('🎨 Route drawn on map')
  }

  // Limpiar ruta del mapa
  const clearRoute = (map: Map) => {
    if (!map) return

    if (map.getLayer('route')) {
      map.removeLayer('route')
    }
    if (map.getSource('route')) {
      map.removeSource('route')
    }

    route.value = null
    console.log('🧹 Route cleared from map')
  }

  // Calcular y dibujar ruta
  const calculateAndDrawRoute = async (map: Map, destination: [number, number]) => {
    const routeData = await getRoute(destination)
    if (routeData && map) {
      // Esperar a que el mapa esté listo
      if (map.isStyleLoaded()) {
        drawRoute(map, routeData)
      } else {
        map.once('load', () => {
          drawRoute(map, routeData)
        })
      }
    }
    return routeData
  }

  // Formatear distancia
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`
    }
    return `${(meters / 1000).toFixed(2)} km`
  }

  // Formatear duración
  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60)
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}min`
  }

  // Calcular costo de envío basado en la ruta
  const deliveryCost = computed(() => {
    if (!route.value) return null
    return calculateDeliveryCost(route.value.distance, route.value.duration)
  })

  return {
    route: readonly(route),
    isLoadingRoute: readonly(isLoadingRoute),
    routeError: readonly(routeError),
    deliveryCost: readonly(deliveryCost),
    getRoute,
    drawRoute,
    clearRoute,
    calculateAndDrawRoute,
    formatDistance,
    formatDuration
  }
}
