<script setup lang="ts">
import { STORE_LOCATION } from '~/constants'

const selectedLocation = ref(false)
const sheetExpanded = ref(false)
const orderStore = useOrderStore()

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

const handleConfirmLocation = () => {
  orderStore.setDeliveryLocation({
    lat: markerPosition.value.lat,
    lng: markerPosition.value.lng
  })
  selectedLocation.value = true
}

onBeforeMount(async () => {
  await getUserPosition()
})

onBeforeUnmount(() => {
  resetLocation()
})

useSeoMeta({
  title: "Seleccionar Ubicación - 24 Horas de Fiesta | Dirección de Entrega",
  description: "Selecciona tu ubicación exacta para la entrega de bebidas y botanas 24/7. Confirma tu dirección de domicilio para recibir tu pedido.",
  keywords: "seleccionar ubicación, dirección entrega, mapa ubicación, 24 horas fiesta, delivery bebidas, domicilio",
  author: "24 Horas de Fiesta",

  // Open Graph
  ogTitle: "Seleccionar Ubicación - 24 Horas de Fiesta",
  ogDescription: "Selecciona tu ubicación exacta para la entrega de bebidas y botanas 24/7. Confirma tu dirección de domicilio.",
  ogType: "website",
  ogUrl: "https://24link.pages.dev/ubicacion",
  ogImage: "./images/icono-24link.png",
  ogSiteName: "24 Horas de Fiesta",

  // Twitter Card
  twitterCard: "summary_large_image",
  twitterTitle: "Seleccionar Ubicación - 24 Horas de Fiesta",
  twitterDescription: "Selecciona tu ubicación exacta para la entrega de bebidas y botanas 24/7.",
  twitterImage: "./images/icono-24link.png",

  // Structured data hints for search engines
  robots: "noindex, follow",
  viewport: "width=device-width, initial-scale=1",
});
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

    <LocationBottomSheet v-if="!selectedLocation && isLocationLoaded && !isLoadingLocation"
      v-model:sheet-expanded="sheetExpanded" :tooltip-content="tooltipContent"
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