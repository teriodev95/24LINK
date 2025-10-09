<script setup lang="ts">
interface Props {
  zoom: number
  mapCenter: [number, number]
  tileProvider: {
    url: string
    attribution: string
  }
  storeLocation: {
    lat: number
    lng: number
  }
  selectedLocation: boolean
}

interface Emits {
  (e: 'moveend', event: { target: { getCenter: () => any } }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const mapRef = ref<{ leafletObject?: any } | null>(null)

const toggleMapInteraction = () => {
  if (mapRef.value?.leafletObject) {
    const map = mapRef.value.leafletObject
    if (props.selectedLocation) {
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

watch(() => props.selectedLocation, () => {
  toggleMapInteraction()
})

onMounted(() => {
  nextTick(() => {
    toggleMapInteraction()
  })
})
</script>

<template>
  <LMap ref="mapRef" class="w-full h-full z-0" :zoom="zoom" :center="mapCenter" :use-global-leaflet="false"
    @moveend="(event) => emit('moveend', event)">
    <LTileLayer :url="tileProvider.url" :attribution="tileProvider.attribution" />

    <!-- Store Location Marker -->
    <LMarker :lat-lng="[storeLocation.lat, storeLocation.lng]">
      <LIcon icon-url="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
        shadow-url="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png"
        :shadow-size="[41, 41]" :shadow-anchor="[12, 41]" />
      <LPopup>
        <div class="text-center">
          <p class="font-semibold text-gray-900">🏪 Tienda 24LINK</p>
          <p class="text-sm text-gray-600">Punto de origen</p>
        </div>
      </LPopup>
    </LMarker>
  </LMap>
</template>