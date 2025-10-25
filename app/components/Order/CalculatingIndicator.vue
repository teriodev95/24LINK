<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Calculando costo de envío...'
})
</script>

<template>
  <div class="flex items-center gap-2 p-2 text-sm text-gray-600">
    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#001954]" />
    <span>{{ message }}</span>
  </div>
</template>