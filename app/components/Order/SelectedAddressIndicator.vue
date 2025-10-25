<script setup lang="ts">
import type { Address } from '~/interfaces'

interface Props {
  address: Address
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-start gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
    <LucideCheckCircle2 :size="16" class="text-green-600 flex-shrink-0 mt-0.5" />
    <p class="text-green-800 text-xs font-medium line-clamp-2 flex-1">
      Dirección seleccionada: {{ address.street }}, {{ address.colony }}
    </p>
  </div>
</template>