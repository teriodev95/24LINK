<script setup lang="ts">
const cartStore = useCartStore()
</script>
<template>
  <UIFormSection title="Detalles del pago">
    <div class="space-y-4">
      <p class="flex justify-between">
        <span class="text-sm font-normal text-[#001954]">Total en productos</span>
        <span>{{ formatCurrency(cartStore.totalAmount) }}</span>
      </p>
      <p class="flex justify-between">
        <span class="text-sm font-normal text-[#001954]">Tarifa de entrega</span>
        <span>{{ formatCurrency(50) }}</span>
      </p>

      <hr class="border-t-2 border-[#898989]">

      <p class="flex justify-between items-center">
        <span class="text-sm font-normal text-[#001954]">Total</span>
        <span class="text-lg font-bold">{{ formatCurrency(cartStore.totalAmount + 50) }}</span>
      </p>
    </div>
  </UIFormSection>
</template>
