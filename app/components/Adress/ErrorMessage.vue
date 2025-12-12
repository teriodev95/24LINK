<script setup lang="ts">
interface Props {
  visible: boolean
}

interface Emits {
  (e: 'dismiss'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div v-if="visible" class="bg-red-50 border-2 border-red-200 rounded-lg p-4">
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
        <LucideAlertTriangle :size="20" class="text-red-600" />
      </div>
      <div class="flex-1">
        <h4 class="text-red-900 font-semibold text-sm mb-1">
          No podemos calcular el envío a esta dirección
        </h4>
        <p class="text-red-700 text-xs leading-relaxed mb-3">
          La dirección seleccionada no tiene coordenadas válidas o está fuera de nuestra área de cobertura. Por
          favor, selecciona otra dirección o agrega una nueva con la ubicación correcta.
        </p>
        <div class="flex items-center gap-2">
          <button class="text-xs text-red-700 hover:text-red-900 font-medium underline transition-colors"
            @click="$emit('dismiss')">
            Entendido, seleccionaré otra dirección
          </button>
        </div>
      </div>
    </div>
  </div>
</template>