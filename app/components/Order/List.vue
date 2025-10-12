<script lang="ts" setup>
import type { OrderWithAddress } from '~/interfaces';

interface Props {
  orders: OrderWithAddress[]
  isLoading?: boolean
}
withDefaults(defineProps<Props>(), {
  isLoading: false
})

// Formatear dirección
const formatAddress = (direccion: OrderWithAddress['direccion']) => `${direccion.calle} #${direccion.numero_exterior}`;
</script>

<template>
  <!-- Loading state -->
  <section v-if="isLoading" class="flex gap-[10px] overflow-x-auto w-full p-2">
    <div v-for="i in 3" :key="i"
      class="flex whitespace-nowrap items-center justify-between gap-2 rounded-lg py-2.5 px-4 bg-white drop-shadow-lg border-l-2 border-l-gray-300 animate-pulse">
      <div class="w-16 h-4 bg-gray-200 rounded" />
      <div class="w-20 h-4 bg-gray-200 rounded" />
      <div class="w-24 h-4 bg-gray-200 rounded" />
    </div>
  </section>

  <!-- Orders list -->
  <section v-else-if="orders.length > 0" class="flex gap-[10px] overflow-x-auto w-full p-2">
    <NuxtLink v-for="order in orders" :key="order.id" :to="`/status-pedido?pedido=${order.numero_pedido}`"
      class="flex whitespace-nowrap items-center justify-between gap-3 rounded-lg py-2.5 px-4 bg-white drop-shadow-lg border-l-2 border-l-[#001954] hover:bg-gray-50 transition-colors">
      <span class="text-primary font-bold">{{ formatCurrency(order.total) }}</span>
      <span class="text-secondary text-sm">{{ formatAddress(order.direccion) }}</span>
      <span class="text-secondary text-sm">{{ order.numero_pedido }}</span>
    </NuxtLink>
  </section>

  <!-- Empty state -->
  <section v-else class="p-4 text-center text-gray-500">
    <p class="text-sm">No tienes pedidos realizados</p>
  </section>
</template>