<script lang="ts" setup>
import type { OrderWithAddress } from '~/interfaces';

interface Props {
  orders: OrderWithAddress[]
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const filteredOrders = computed(() => props.orders.filter(order => order.estado !== 'completado'))
</script>

<template>
  <div v-if="filteredOrders.length > 0" class="fixed top-0 left-0 right-0 z-50 bg-[#10B981] shadow-md h-14">
    <div class="flex overflow-x-auto scrollbar-hide h-full">
      <OrderListItem v-for="order in filteredOrders" :key="order.id" :order="order" />
    </div>
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