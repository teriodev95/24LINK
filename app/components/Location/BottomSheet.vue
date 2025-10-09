<script setup lang="ts">
interface Props {
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
  >
    <!-- Sheet Handle -->
    <div class="flex justify-center pt-3 pb-2">
      <button class="w-12 h-1.5 bg-gray-300 rounded-full" @click="toggleSheet" />
    </div>

    <!-- Sheet Content -->
    <div class="px-6 pb-6">
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