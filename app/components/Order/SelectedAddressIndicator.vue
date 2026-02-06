<script setup lang="ts">
import type { Address } from '~/interfaces'

interface Props {
  address: Address
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-3 bg-emerald-50 rounded-2xl p-3.5">
    <div class="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
      <Icon name="lucide:check-circle-2" size="18" class="text-emerald-600" />
    </div>
    <p class="text-[13px] font-medium text-emerald-800 leading-tight line-clamp-2 flex-1">
      {{ address.street }}, {{ address.colony }}
    </p>
  </div>
</template>
