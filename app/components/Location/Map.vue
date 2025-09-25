<script setup lang="ts">
const mapRef = ref(null)
const selectedLocation = ref(false)

const {
  markerPosition,
  zoom,
  tileProvider,
  mapCenter,
  tooltipContent,
  getUserPosition,
  onMapMove
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

onMounted(async () => {
  await getUserPosition()
  nextTick(() => {
    toggleMapInteraction()
  })
})

defineExpose({
  markerPosition
})
</script>

<template>
  <div class="fixed inset-0 w-full h-full">

    <LMap ref="mapRef" class="w-full h-full z-0" :zoom="zoom" :center="mapCenter" :use-global-leaflet="false"
      @moveend="onMapMove">
      <LTileLayer :url="tileProvider.url" :attribution="tileProvider.attribution" />
    </LMap>

    <div class="absolute top-0 left-0 right-0 z-10 p-4">
      <UINavbar title="Volver" to="/" />
    </div>

    <!-- Static Center Marker -->
    <div v-show="!selectedLocation" class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div class="relative">
        <!-- Marker Pin -->
        <div class="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full" />
        </div>
        <!-- Tooltip -->
        <div
          class="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {{ tooltipContent }}
        </div>
      </div>
    </div>

    <!-- Overlay Panel -->
    <LocationForm v-if="selectedLocation" @action:location-selection="selectedLocation = false" />

    <div v-else class="absolute left-4 right-4 bottom-4 p-4">
      <UIButtonAction type="button" label="Seleccionar" class-name="w-full" @click="selectedLocation = true" />
    </div>
  </div>
</template>


<style>
.leaflet-control-zoom {
  display: none;
}
</style>