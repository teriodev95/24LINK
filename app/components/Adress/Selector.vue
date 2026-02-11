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
  <div class="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-2 px-2">
    <!-- Add new address -->
    <NuxtLink
      to="/ubicacion"
      class="group flex-shrink-0 w-[100px] h-[76px] rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 active:scale-[0.97] transition-all duration-200 hover:bg-gray-100 hover:border-gray-300"
    >
      <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
        <Icon name="lucide:plus" size="16" class="text-[#001954]" />
      </div>
      <span class="text-[10px] text-gray-500 font-bold tracking-tight">Nueva dirección</span>
    </NuxtLink>

    <!-- Saved addresses -->
    <button
      v-for="address in addresses"
      :key="address.id"
      class="relative group flex-shrink-0 min-w-[150px] max-w-[200px] h-[76px] rounded-2xl p-3.5 text-left transition-all duration-200 active:scale-[0.97] border-2"
      :class="selectedAddressId === address.id
        ? 'bg-[#001954] border-[#001954] shadow-lg shadow-[#001954]/20' 
        : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'"
      :disabled="isCalculating"
      @click="$emit('selectAddress', address)"
    >
      <!-- Selected Check Icon -->
      <div v-if="selectedAddressId === address.id" class="absolute top-2 right-2">
         <Icon name="lucide:check-circle-2" size="14" class="text-emerald-400" />
      </div>

      <div class="flex flex-col h-full justify-center">
        <p 
          class="text-[12px] font-bold truncate leading-tight mb-1"
          :class="selectedAddressId === address.id ? 'text-white' : 'text-[#001954]'"
        >
          {{ address.street }}
        </p>
        <p 
          class="text-[10px] line-clamp-2 leading-relaxed"
          :class="selectedAddressId === address.id ? 'text-white/70' : 'text-gray-400'"
        >
          {{ address.colony }}
        </p>
      </div>
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
