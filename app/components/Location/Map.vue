<script setup lang="ts">
const mapRef = ref(null)
const selectedLocation = ref(false)

const {
  zoom,
  tileProvider,
  mapCenter,
  tooltipContent,
  isLocationLoaded,
  isLoadingLocation,
  getUserPosition,
  onMapMove,
  resetLocation
} = useMapLocation()

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

onBeforeMount(async () => {
  await getUserPosition()
  nextTick(() => {
    toggleMapInteraction()
  })
})

onBeforeUnmount(() => {
  resetLocation()
})
</script>

<template>
  <div class="fixed inset-0 w-full h-full">
    <!-- Loading State -->
    <div v-if="isLoadingLocation" class="absolute inset-0 bg-white z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p class="text-gray-600">Obteniendo tu ubicación...</p>
      </div>
    </div>

    <LMap v-show="isLocationLoaded && !isLoadingLocation" ref="mapRef" class="w-full h-full z-0" :zoom="zoom" :center="mapCenter" :use-global-leaflet="false"
      @moveend="onMapMove">
      <LTileLayer :url="tileProvider.url" :attribution="tileProvider.attribution" />
    </LMap>

    <div class="absolute top-0 left-0 right-0 z-10 px-2 py-6">
      <UINavbar title="Selecciona una dirección" to="/detalles-orden" />
    </div>

    <!-- Static Center Marker -->
    <div v-show="!selectedLocation && isLocationLoaded && !isLoadingLocation" class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
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

    <!-- Overlay Panel -->
    <LocationForm v-if="selectedLocation && isLocationLoaded && !isLoadingLocation" @action:location-selection="selectedLocation = false" />

    <div v-else-if="isLocationLoaded && !isLoadingLocation" class="absolute left-4 right-4 bottom-4 p-4">
      <UIButtonAction label="Seleccionar" class-name="w-full" @click="selectedLocation = true" />
    </div>
  </div>
</template>


<style>
.leaflet-control-zoom {
  display: none;
}
</style>