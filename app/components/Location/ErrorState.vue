<script setup lang="ts">
interface Props {
  locationError: string
  hasPermission: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="absolute top-20 left-4 right-4 z-50">
    <div class="bg-white/90 backdrop-blur-sm border border-amber-200 rounded-2xl px-4 py-3 shadow-lg">
      <p class="text-[13px] font-medium text-amber-700">
        No pudimos obtener tu ubicación exacta. Mueve el mapa para marcar dónde estás.
      </p>
      <p v-if="!hasPermission" class="text-[11px] text-amber-500 mt-1">
        Puedes habilitar la ubicación en la configuración de tu navegador.
      </p>
    </div>
  </div>
</template>
