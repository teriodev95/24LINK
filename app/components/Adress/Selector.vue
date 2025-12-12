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
  <div class="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
    <!-- Botón agregar nueva dirección -->
    <NuxtLink to="/ubicacion"
      class="flex-shrink-0 w-32 h-24 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-[#001954] hover:bg-gray-50 transition-all duration-200 flex flex-col items-center justify-center gap-2 group">
      <div
        class="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#001954] transition-colors flex items-center justify-center">
        <LucidePlus :size="20" class="text-gray-600 group-hover:text-white transition-colors" />
      </div>
      <span class="text-xs text-gray-600 group-hover:text-[#001954] font-medium transition-colors">
        Nueva dirección
      </span>
    </NuxtLink>

    <!-- Direcciones guardadas -->
    <UISelectionButton v-for="address in addresses" :key="address.id"
      :item="{ title: address.street, description: address.colony }" :is-selected="selectedAddressId === address.id"
      custom-class="flex-shrink-0 min-w-[160px] max-w-[240px]" :disabled="isCalculating"
      @select="$emit('selectAddress', address)" />
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
