<script setup lang="ts">
import type { Address } from '~/interfaces'

interface Props {
  addresses: Address[]
  selectedAddressId?: string
  isCalculating: boolean
}

interface Emits {
  (e: 'selectAddress', address: Address): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div class="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
    <!-- Add new address -->
    <NuxtLink
      to="/ubicacion"
      class="flex-shrink-0 w-[110px] h-[72px] rounded-xl bg-gray-100 flex flex-col items-center justify-center gap-1 active:scale-[0.97] transition-all duration-150"
    >
      <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center">
        <Icon name="lucide:plus" size="16" class="text-[#001954]" />
      </div>
      <span class="text-[10px] text-gray-500 font-medium">Nueva dirección</span>
    </NuxtLink>

    <!-- Saved addresses -->
    <button
      v-for="address in addresses"
      :key="address.id"
      class="flex-shrink-0 min-w-[140px] max-w-[200px] h-[72px] rounded-xl p-3 text-left transition-all duration-150 active:scale-[0.97] border-2"
      :class="selectedAddressId === address.id
        ? 'bg-[#001954]/5 border-[#001954]'
        : 'bg-gray-100 border-transparent'"
      :disabled="isCalculating"
      @click="$emit('selectAddress', address)"
    >
      <p class="text-[12px] font-semibold text-[#001954] truncate leading-tight">
        {{ address.street }}
      </p>
      <p class="text-[10px] text-gray-400 line-clamp-2 mt-0.5">
        {{ address.colony }}
      </p>
    </button>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
