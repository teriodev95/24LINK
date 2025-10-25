<script lang="ts" setup>
import type { OrderWithAddress } from '~/interfaces';

interface Props {
  orders: OrderWithAddress[]
  isLoading?: boolean
}
withDefaults(defineProps<Props>(), {
  isLoading: false
})
</script>

<template>
  <!-- Loading state -->
  <OrderListSkeleton v-if="isLoading" />

  <!-- Orders list - Fixed version estilo Uber Eats -->
  <section v-else-if="orders.length > 0"
    class="fixed top-0 left-0 right-0 z-50 shadow-md bg-gradient-to-r from-green-600 to-green-700">
    <div class="flex overflow-x-auto scrollbar-hide">
      <OrderListItem
        v-for="order in orders"
        :key="order.id"
        :order="order"
      />
    </div>
  </section>
</template>

<style scoped>
/* Ocultar scrollbar pero mantener funcionalidad */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>