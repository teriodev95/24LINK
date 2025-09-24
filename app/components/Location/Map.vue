<script setup lang="ts">
const mapRef = ref(null)

const {
  isDragging,
  markerPosition,
  zoom,
  tileProvider,
  mapCenter,
  tooltipContent,
  getUserPosition,
  onMapClick,
  onMarkerDragEnd
} = useMapLocation()

onMounted(async () => {
  await getUserPosition()
})

defineExpose({
  markerPosition
})
</script>

<template>
  <div class="fixed inset-0 w-full h-full">
    <LMap ref="mapRef" class="w-full h-full z-0" :zoom="zoom" :center="mapCenter" :use-global-leaflet="false"
      @click="onMapClick">
      <LTileLayer :url="tileProvider.url" :attribution="tileProvider.attribution" />

      <!-- Location Marker -->
      <LMarker v-if="markerPosition.lat && markerPosition.lng" :lat-lng="markerPosition" :draggable="true"
        @dragstart="isDragging = true" @dragend="onMarkerDragEnd">
        <LTooltip :options="{ permanent: true }">
          <div>{{ tooltipContent }}</div>
        </LTooltip>
      </LMarker>
    </LMap>

    <!-- Overlay Panel -->
    <LocationForm />
  </div>
</template>
