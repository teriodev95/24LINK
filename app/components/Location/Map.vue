<script setup lang="ts">
import type { Map as MapboxMap } from 'mapbox-gl'

const mapContainer = ref<HTMLElement | null>(null)
const selectedLocation = ref(false)
const map = ref<MapboxMap | null>(null)
const mounted = ref(false)
const sheetExpanded = ref(false)
const orderStore = useOrderStore()
const cartStore = useCartStore()

const {
  mapCenter,
  tooltipContent,
  isLocationLoaded,
  isLoadingLocation,
  getUserPosition,
  updateMarkerPosition,
  resetLocation,
  markerPosition,
  STORE_LOCATION
} = useMapLocation()

const {
  createMap,
  addMarker,
  cleanup: cleanupMapbox
} = useMapbox()

const {
  calculateAndDrawRoute,
  clearRoute,
  route,
  formatDistance,
  formatDuration,
  deliveryCost
} = useMapboxDirections()

const storeMarker = ref()

// Información de la ruta
const routeInfo = computed(() => {
  if (!route.value || !deliveryCost.value) return null
  return {
    distance: formatDistance(route.value.distance),
    duration: formatDuration(route.value.duration),
    cost: deliveryCost.value
  }
})

const toggleMapInteraction = (enabled: boolean) => {
  if (!map.value) return

  if (enabled) {
    map.value.dragPan.enable()
    map.value.scrollZoom.enable()
    map.value.doubleClickZoom.enable()
    map.value.touchZoomRotate.enable()
  } else {
    map.value.dragPan.disable()
    map.value.scrollZoom.disable()
    map.value.doubleClickZoom.disable()
    map.value.touchZoomRotate.disable()
  }
}

watch(selectedLocation, (isSelected) => {
  toggleMapInteraction(!isSelected)
})

// Actualizar ruta cuando cambia la posición del marcador (con debounce optimizado)
let routeTimeout: NodeJS.Timeout | null = null
let lastRouteUpdate = 0
const ROUTE_UPDATE_DELAY = 800 // Aumentar delay para reducir cálculos
const MIN_DISTANCE_CHANGE = 0.001 // Mínimo cambio en coordenadas para recalcular

watch(markerPosition, async (newPosition, oldPosition) => {
  if (!map.value || !newPosition.lat || !newPosition.lng || !mounted.value) return

  // Evitar cálculos innecesarios si el cambio es mínimo
  if (oldPosition &&
      Math.abs(newPosition.lat - oldPosition.lat) < MIN_DISTANCE_CHANGE &&
      Math.abs(newPosition.lng - oldPosition.lng) < MIN_DISTANCE_CHANGE) {
    return
  }

  // Cancelar timeout anterior
  if (routeTimeout) {
    clearTimeout(routeTimeout)
  }

  // Throttling: evitar cálculos muy frecuentes
  const now = Date.now()
  const timeSinceLastUpdate = now - lastRouteUpdate

  const delay = timeSinceLastUpdate < ROUTE_UPDATE_DELAY ?
    ROUTE_UPDATE_DELAY - timeSinceLastUpdate : 0

  routeTimeout = setTimeout(async () => {
    if (map.value && map.value.isStyleLoaded()) {
      lastRouteUpdate = Date.now()
      clearRoute(map.value)
      const destination: [number, number] = [newPosition.lng, newPosition.lat]
      await calculateAndDrawRoute(map.value, destination)
    }
  }, delay)
}, { deep: true })

const initializeMap = () => {
  if (!mapContainer.value || map.value) return

  console.log('🗺️ Inicializando mapa Mapbox...', {
    container: mapContainer.value,
    center: mapCenter.value
  })

  try {
    // Crear mapa
    map.value = createMap({
      container: mapContainer.value,
      center: mapCenter.value,
      zoom: 15
    })

    // Esperar a que el mapa cargue completamente
    map.value.on('load', () => {
      console.log('✅ Mapa cargado completamente')

      if (!map.value) return

      // Agregar marcador de la tienda (origen)
      storeMarker.value = addMarker(
        [STORE_LOCATION.lng, STORE_LOCATION.lat],
        {
          color: '#ef4444', // Rojo para la tienda
          scale: 1.2
        }
      )

      // Calcular ruta inicial
      const destination: [number, number] = [markerPosition.value.lng, markerPosition.value.lat]
      calculateAndDrawRoute(map.value, destination)

      console.log('✅ Marcador de tienda agregado y ruta inicial calculada')
    })

    // Escuchar cuando el mapa se mueve con throttling adicional
    let moveEndTimeout: NodeJS.Timeout | null = null
    map.value.on('moveend', () => {
      if (!selectedLocation.value && map.value) {
        // Añadir un pequeño delay adicional para evitar actualizaciones muy rápidas
        if (moveEndTimeout) {
          clearTimeout(moveEndTimeout)
        }

        moveEndTimeout = setTimeout(() => {
          if (map.value && !selectedLocation.value) {
            const center = map.value.getCenter()
            updateMarkerPosition({
              lat: center.lat,
              lng: center.lng
            })
          }
        }, 150) // Pequeño delay para suavizar la experiencia
      }
    })

    console.log('✅ Mapa Mapbox inicializado')
  } catch (error) {
    console.error('❌ Error inicializando mapa:', error)
  }
}

// Optimizar carga inicial - no cargar ubicación hasta que sea necesario
onBeforeMount(() => {
  console.log('🚀 Map.vue: Iniciando componente de mapa')
  // Remover la carga automática de ubicación para mejorar rendimiento inicial
})

onMounted(() => {
  mounted.value = true
  console.log('🔧 Map.vue: Componente montado')

  // Lazy loading: cargar ubicación y mapa solo cuando sea necesario
  nextTick(async () => {
    // Cargar ubicación de forma lazy
    await getUserPosition()

    // Inicializar mapa con un delay mínimo para mejorar perceived performance
    setTimeout(() => {
      if (!isLoadingLocation.value) {
        initializeMap()
      }
    }, 50) // Reducir delay para mejor UX
  })
})

watch(isLocationLoaded, (loaded) => {
  if (loaded && !isLoadingLocation.value && !map.value && mounted.value) {
    nextTick(() => {
      setTimeout(() => {
        initializeMap()
      }, 100)
    })
  }
})

onBeforeUnmount(() => {
  console.log('👋 Map.vue: Desmontando componente y limpiando recursos')
  mounted.value = false

  // Limpiar todos los timeouts
  if (routeTimeout) {
    clearTimeout(routeTimeout)
    routeTimeout = null
  }

  // Limpiar ruta del mapa
  if (map.value) {
    clearRoute(map.value)
  }

  // Remover marcadores
  if (storeMarker.value) {
    storeMarker.value.remove()
    storeMarker.value = null
  }

  // Limpiar recursos de Mapbox
  cleanupMapbox()
  resetLocation()
})
</script>

<template>
  <div class="fixed inset-0 w-full h-full bg-white">
    <!-- Loading State -->
    <div v-if="isLoadingLocation" class="absolute inset-0 bg-white z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
        <p class="text-gray-600">Obteniendo tu ubicación...</p>
      </div>
    </div>

    <!-- Mapbox Container - Fullscreen -->
    <div class="absolute inset-0 w-full h-full">
      <div v-show="isLocationLoaded && !isLoadingLocation" ref="mapContainer" class="absolute inset-0 w-full h-full" />

      <!-- Location Picker - Centro exacto de la pantalla -->
      <div v-show="!selectedLocation && isLocationLoaded && !isLoadingLocation"
        class="absolute pointer-events-none z-20" style="left: 50%; top: 50%; transform: translate(-50%, -50%);">
        <!-- Círculos concéntricos animados -->
        <div class="relative flex items-center justify-center">
          <!-- Onda externa animada -->
          <div class="absolute w-16 h-16 bg-[#001954] rounded-full opacity-20 animate-ping" />

          <!-- Círculo medio -->
          <div class="absolute w-12 h-12 bg-[#001954] rounded-full opacity-30" />

          <!-- Punto central -->
          <div class="relative">
            <!-- Punto interior con sombra -->
            <div class="w-5 h-5 bg-[#001954] rounded-full shadow-lg" />

            <!-- Cruz de precisión -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-12 h-0.5 bg-[#001954] opacity-40" style="position: absolute;" />
              <div class="w-0.5 h-12 bg-[#001954] opacity-40" style="position: absolute;" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Back Button -->
    <button v-if="!selectedLocation && isLocationLoaded && !isLoadingLocation"
      class="absolute top-6 left-4 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
      @click="$router.push('/detalles-orden')">
      <svg class="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Bottom Sheet -->
    <div v-if="routeInfo && !selectedLocation && isLocationLoaded && !isLoadingLocation"
      class="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl transition-all duration-300"
      :class="sheetExpanded ? 'h-96' : 'h-auto'">
      <!-- Sheet Handle -->
      <div class="flex justify-center pt-3 pb-2">
        <button class="w-12 h-1.5 bg-gray-300 rounded-full" @click="sheetExpanded = !sheetExpanded" />
      </div>

      <!-- Sheet Content -->
      <div class="px-6 pb-6">
        <!-- Costo de envío -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <div>
              <p class="text-sm text-gray-500 font-medium">Costo de envío</p>
              <p class="text-3xl font-bold text-[#001954]">${{ Math.round(routeInfo.cost.totalCost) }} MXN</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">{{ routeInfo.distance }}</p>
              <p class="text-sm text-gray-600">{{ routeInfo.duration }}</p>
            </div>
          </div>
        </div>

        <!-- Desglose -->
        <div v-if="sheetExpanded" class="mb-4 space-y-2 p-4 bg-gray-50 rounded-lg">
          <p class="text-xs font-semibold text-gray-700 mb-3">Desglose del costo</p>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Tarifa base</span>
            <span class="font-semibold text-gray-900">${{ Math.round(routeInfo.cost.baseCost) }} MXN</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Por distancia</span>
            <span class="font-semibold text-gray-900">${{ Math.round(routeInfo.cost.distanceCost) }} MXN</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Por tiempo</span>
            <span class="font-semibold text-gray-900">${{ Math.round(routeInfo.cost.timeCost) }} MXN</span>
          </div>
        </div>

        <!-- Coordenadas -->
        <div class="mb-5 p-3 bg-gray-50 rounded-lg">
          <p class="text-xs text-gray-500 mb-1">Ubicación seleccionada</p>
          <p class="text-sm font-mono text-gray-900">{{ tooltipContent }}</p>
        </div>

        <!-- Botón de acción -->
        <UIButtonAction label="Confirmar ubicación" class-name="w-full" @click="() => {
          if (routeInfo && route) {
            // Guardar ubicación y costo en el store
            orderStore.setDeliveryLocation({
              lat: markerPosition.lat,
              lng: markerPosition.lng
            })
            orderStore.setDeliveryCost(Math.round(routeInfo.cost.totalCost))
            orderStore.setDeliveryDistance(route.distance)
            orderStore.setDeliveryDuration(route.duration)

            // Actualizar totales del carrito con el nuevo costo de envío
            cartStore.updateCartTotals()
          }
          selectedLocation = true
        }" />
      </div>
    </div>

    <!-- Overlay Panel (cuando se confirma) -->
    <LocationForm v-if="selectedLocation && isLocationLoaded && !isLoadingLocation"
      @action:location-selection="selectedLocation = false" />
  </div>
</template>
