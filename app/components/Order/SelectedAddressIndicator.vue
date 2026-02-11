<script setup lang="ts">
import type { Address } from '~/interfaces'

interface Props {
  address: Address
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-start gap-3 bg-emerald-50/60 rounded-xl p-4 border border-emerald-100/50 transition-all hover:bg-emerald-50/80">
    <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm border border-emerald-200/50 mt-0.5">
      <Icon name="lucide:check" size="16" class="text-emerald-600 stroke-[3]" />
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Ubicación confirmada</p>
      <p class="text-[13px] font-bold text-[#001954] leading-tight line-clamp-2">
        {{ address.street }}, {{ address.colony }}
      </p>
    </div>
  </div>
</template>
