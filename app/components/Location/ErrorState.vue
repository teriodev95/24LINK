<script setup lang="ts">
interface Props {
  locationError: string
  hasPermission: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="absolute top-20 left-4 right-4 z-50">
    <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
      <p class="text-sm">
        ⚠️ {{ locationError }}. Usando ubicación de Ciudad de México.
      </p>
      <p v-if="!hasPermission" class="text-xs mt-1">
        💡 Puedes habilitar la ubicación en la configuración de tu navegador.
      </p>
    </div>
  </div>
</template>