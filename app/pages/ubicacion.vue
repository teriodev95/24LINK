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