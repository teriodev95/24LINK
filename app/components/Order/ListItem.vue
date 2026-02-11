<script lang="ts" setup>
import type { OrderWithAddress } from '~/interfaces';

interface Props {
  order: OrderWithAddress
}

defineProps<Props>()

// Format address helper
const formatAddress = (direccion: OrderWithAddress['direccion']) => {
  if (!direccion) return 'En camino'
  return `${direccion.calle} #${direccion.numero_exterior}`
}
</script>

<template>
  <NuxtLink :to="`/status-pedido?pedido=${order.numero_pedido}`"
    class="flex-shrink-0 min-w-full h-full flex items-center justify-between px-4 hover:bg-white/10 transition-all duration-200">
    
    <!-- Left Content -->
    <div class="flex items-center gap-3 min-w-0">
      <div class="flex items-center gap-2">
         <div class="relative flex h-2.5 w-2.5">
           <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
           <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
         </div>
      </div>
      
      <div class="flex flex-col min-w-0">
        <span class="text-white font-bold text-[13px] leading-tight truncate">
          Pedido en curso • {{ formatCurrency(order.total) }}
        </span>
        <span class="text-white/80 text-[11px] leading-tight truncate">
          {{ formatAddress(order.direccion) }} • {{ order.numero_pedido }}
        </span>
      </div>
    </div>

    <!-- Right Arrow -->
    <div class="pl-2">
      <Icon name="lucide:chevron-right" size="18" class="text-white" />
    </div>
  </NuxtLink>
</template>