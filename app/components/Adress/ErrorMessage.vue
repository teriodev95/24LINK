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
  <div v-if="visible" class="flex items-start gap-3 bg-red-50 rounded-2xl p-3.5">
    <div class="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
      <Icon name="lucide:alert-triangle" size="18" class="text-red-500" />
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-[13px] font-semibold text-red-800 leading-tight mb-0.5">
        No podemos calcular el envío
      </p>
      <p class="text-[11px] text-red-600 leading-relaxed mb-2">
        La dirección no tiene coordenadas válidas o está fuera de nuestra cobertura.
      </p>
      <button
        class="text-[11px] text-red-700 font-semibold active:text-red-900 transition-colors"
        @click="$emit('dismiss')"
      >
        Seleccionar otra dirección
      </button>
    </div>
  </div>
</template>
