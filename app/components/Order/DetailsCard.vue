<script setup lang="ts">
const cartStore = useCartStore()
</script>
<template>
  <section class="p-4 border space-y-4 rounded-lg">
    <h2 class="text-[#001954] font-bold">Detalles del pago</h2>

    <div class="space-y-4">
      <p class="flex justify-between">
        <span class="text-sm font-normal text-[#001954]">Total en productos</span> <span>{{
          formatCurrency(cartStore.totalAmount) }}</span>
      </p>
      <p class="flex justify-between">
        <span class="text-sm font-normal text-[#001954]">Tarifa de entrega</span> <span>{{ formatCurrency(50) }}</span>
      </p>

      <hr class="border-t-2 border-[#898989]">

      <p class="flex justify-between items-center">
        <span class="text-sm font-normal text-[#001954]">Total</span>
        <span class="text-lg font-bold">{{
          formatCurrency(cartStore.totalAmount + 50) }}</span>
      </p>
    </div>
  </section>
</template>
