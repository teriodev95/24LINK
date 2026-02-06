<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Calculando costo de envío...'
})
</script>

<template>
  <div class="flex items-center gap-3 bg-gray-50/80 rounded-2xl p-3.5">
    <div class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
      <div class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-[#001954]" />
    </div>
    <span class="text-[13px] text-gray-500">{{ message }}</span>
  </div>
</template>
