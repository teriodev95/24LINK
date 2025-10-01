<script lang="ts" setup>
import type { Order } from '~/interfaces';

interface Props {
  orders: Order[];
}

defineProps<Props>();
</script>

<template>
  <section class="flex gap-[10px] overflow-x-auto w-full px-2">
    <NuxtLink v-for="order in orders" :key="order.id" to="/status-pedido"
      class="flex whitespace-nowrap items-center justify-between gap-2 rounded-lg py-2.5 px-4 bg-white drop-shadow-lg border-l-2 border-l-[#001954]">
      <span />
      <span class="text-primary">{{ formatCurrency(order.total) }}</span>
      <span class="text-secondary">calle#45</span>
      <span class="text-secondary">{{ order.id }}</span>
    </NuxtLink>
  </section>
</template>