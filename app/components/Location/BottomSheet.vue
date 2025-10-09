<script setup lang="ts">
interface RouteInfo {
  distance: string
  duration: string
  cost: {
    totalCost: number
    baseCost: number
    distanceCost: number
    timeCost: number
  }
}

interface Props {
  routeInfo: RouteInfo
  sheetExpanded: boolean
  tooltipContent: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:sheetExpanded': [value: boolean]
  confirmLocation: []
}>()

const toggleSheet = () => {
  emit('update:sheetExpanded', !props.sheetExpanded)
}
</script>

<template>
  <div
    class="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl transition-all duration-300"
    :class="sheetExpanded ? 'h-96' : 'h-auto'"
  >
    <!-- Sheet Handle -->
    <div class="flex justify-center pt-3 pb-2">
      <button class="w-12 h-1.5 bg-gray-300 rounded-full" @click="toggleSheet" />
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
      <UIButtonAction
        label="Confirmar ubicación"
        class-name="w-full"
        @click="emit('confirmLocation')"
      />
    </div>
  </div>
</template>