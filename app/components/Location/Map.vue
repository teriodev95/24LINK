<script setup lang="ts">
const mapRef = ref(null)
const selectedLocation = ref(false)
const sheetExpanded = ref(false)
const orderStore = useOrderStore()
const cartStore = useCartStore()

const {
  zoom,
  tileProvider,
  mapCenter,
  tooltipContent,
  isLocationLoaded,
  isLoadingLocation,
  locationError,
  hasPermission,
  getUserPosition,
  onMapMove,
  resetLocation,
  markerPosition
} = useMapLocation()

const {
  getRoute,
  route,
  formatDistance,
  formatDuration,
  deliveryCost
} = useMapboxDirections()

// Importar ubicación de la tienda
const { STORE_LOCATION } = await import('~/constants')

// Información de la ruta
const routeInfo = computed(() => {
  if (!route.value || !deliveryCost.value) return null

  console.log('🛣️ Map.vue: Información de la ruta calculada', {
    distance: route.value.distance,
    duration: route.value.duration,
    cost: deliveryCost.value
  })
  return {
    distance: formatDistance(route.value.distance),
    duration: formatDuration(route.value.duration),
    cost: deliveryCost.value
  }
})

const toggleMapInteraction = () => {
  if (mapRef.value?.leafletObject) {
    const map = mapRef.value.leafletObject
    if (selectedLocation.value) {
      map.dragging.disable()
      map.touchZoom.disable()
      map.doubleClickZoom.disable()
      map.scrollWheelZoom.disable()
      map.boxZoom.disable()
      map.keyboard.disable()
    } else {
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.scrollWheelZoom.enable()
      map.boxZoom.enable()
      map.keyboard.enable()
    }
  }
}

watch(selectedLocation, () => {
  toggleMapInteraction()
})

// Calcular ruta cuando cambia la posición del marcador (con debounce)
let routeTimeout: NodeJS.Timeout | null = null
watch(markerPosition, async (newPosition) => {
  if (!newPosition.lat || !newPosition.lng) return

  // Cancelar timeout anterior
  if (routeTimeout) {
    clearTimeout(routeTimeout)
  }

  // Esperar 500ms antes de calcular ruta
  routeTimeout = setTimeout(async () => {
    const destination: [number, number] = [newPosition.lng, newPosition.lat]
    await getRoute(destination)
  }, 500)
}, { deep: true })

onBeforeMount(async () => {
  console.log('🚀 Map.vue: Iniciando componente de mapa')

  await getUserPosition()

  console.log('📍 Map.vue: Proceso de ubicación completado')
})

onMounted(() => {
  nextTick(() => {
    console.log('🔧 Map.vue: Configurando interacciones del mapa')
    toggleMapInteraction()

    // Calcular ruta inicial si ya tenemos la posición
    if (markerPosition.value.lat && markerPosition.value.lng) {
      const destination: [number, number] = [markerPosition.value.lng, markerPosition.value.lat]
      getRoute(destination)
    }
  })
})

onBeforeUnmount(() => {
  console.log('👋 Map.vue: Desmontando componente y reseteando ubicación')

  if (routeTimeout) {
    clearTimeout(routeTimeout)
  }

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

    <!-- Error State -->
    <div v-if="locationError && isLocationLoaded && !isLoadingLocation" class="absolute top-20 left-4 right-4 z-50">
      <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p class="text-sm">
          ⚠️ {{ locationError }}. Usando ubicación de Ciudad de México.
        </p>
        <p v-if="!hasPermission" class="text-xs mt-1">
          💡 Puedes habilitar la ubicación en la configuración de tu navegador.
        </p>
      </div>
    </div>

    <!-- Leaflet Map Container -->
    <LMap v-if="isLocationLoaded && !isLoadingLocation" ref="mapRef" class="w-full h-full z-0" :zoom="zoom"
      :center="mapCenter" :use-global-leaflet="false" @moveend="onMapMove">
      <LTileLayer :url="tileProvider.url" :attribution="tileProvider.attribution" />

      <!-- Store Location Marker -->
      <LMarker :lat-lng="[STORE_LOCATION.lat, STORE_LOCATION.lng]">
        <LIcon
          :icon-size="[32, 32]"
          :icon-anchor="[16, 32]"
          icon-url="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
          shadow-url="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png"
          :shadow-size="[41, 41]"
          :shadow-anchor="[12, 41]"
        />
        <LPopup>
          <div class="text-center">
            <p class="font-semibold text-gray-900">🏪 Tienda 24LINK</p>
            <p class="text-sm text-gray-600">Punto de origen</p>
          </div>
        </LPopup>
      </LMarker>
    </LMap>

    <!-- Location Picker - Centro exacto de la pantalla -->
    <div v-show="!selectedLocation && isLocationLoaded && !isLoadingLocation" class="absolute pointer-events-none z-20"
      style="left: 50%; top: 50%; transform: translate(-50%, -50%);">
      <!-- Static Center Marker -->
      <div class="relative">
        <!-- Marker Pin -->
        <div class="text-6xl flex items-end justify-center transform -translate-y-[30px]">
          📍
        </div>
        <!-- Tooltip -->
        <div
          class="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {{ tooltipContent }}
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

<style>
.leaflet-control-zoom {
  display: none;
}
</style>
