<script setup lang="ts">
import { STORE_LOCATION } from '~/constants'

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


const routeInfo = computed(() => {
  if (!route.value || !deliveryCost.value) return null
  return {
    distance: formatDistance(route.value.distance),
    duration: formatDuration(route.value.duration),
    cost: deliveryCost.value
  }
})

let routeTimeout: number | null = null

const handleConfirmLocation = () => {
  if (routeInfo.value && route.value) {
    // Guardar ubicación y costo en el store
    orderStore.setDeliveryLocation({
      lat: markerPosition.value.lat,
      lng: markerPosition.value.lng
    })
    orderStore.setDeliveryCost(Math.round(routeInfo.value.cost.totalCost))
    orderStore.setDeliveryDistance(route.value.distance)
    orderStore.setDeliveryDuration(route.value.duration)

    // Actualizar totales del carrito con el nuevo costo de envío
    cartStore.updateCartTotals()
  }
  selectedLocation.value = true
}

watch(markerPosition, async (newPosition) => {
  if (!newPosition.lat || !newPosition.lng) return

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
  await getUserPosition()
})

onMounted(() => {
  nextTick(() => {
    // Calcular ruta inicial si ya tenemos la posición
    if (markerPosition.value.lat && markerPosition.value.lng) {
      const destination: [number, number] = [markerPosition.value.lng, markerPosition.value.lat]
      getRoute(destination)
    }
  })
})
onBeforeUnmount(() => {
  if (routeTimeout) {
    clearTimeout(routeTimeout)
  }

  resetLocation()
})
</script>

<template>
  <div class="fixed inset-0 w-full h-full bg-white">
    <LocationLoadingState v-if="isLoadingLocation" />
    <LocationErrorState v-if="locationError && isLocationLoaded && !isLoadingLocation" :location-error="locationError"
      :has-permission="hasPermission" />

    <LocationMapRenderer v-if="isLocationLoaded && !isLoadingLocation" :zoom="zoom" :map-center="mapCenter"
      :tile-provider="tileProvider" :store-location="STORE_LOCATION" :selected-location="selectedLocation"
      @moveend="onMapMove" />

    <LocationPicker v-show="!selectedLocation && isLocationLoaded && !isLoadingLocation"
      :tooltip-content="tooltipContent" />

    <LocationFloatingBackButton v-if="!selectedLocation && isLocationLoaded && !isLoadingLocation"
      @click="$router.push('/detalles-orden')" />

    <LocationBottomSheet v-if="routeInfo && !selectedLocation && isLocationLoaded && !isLoadingLocation"
      v-model:sheet-expanded="sheetExpanded" :route-info="routeInfo" :tooltip-content="tooltipContent"
      @confirm-location="handleConfirmLocation" />

    <LocationForm v-if="selectedLocation && isLocationLoaded && !isLoadingLocation"
      @action:location-selection="selectedLocation = false" />
  </div>
</template>

<style>
.leaflet-control-zoom {
  display: none;
}
</style>