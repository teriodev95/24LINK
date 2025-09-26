<script setup lang="ts">
const cartStore = useCartStore()
</script>
<template>
  <UIFormSection title="Detalles del pago">
    <div class="space-y-4">
      <p class="flex justify-between">
        <span class="text-secondary">Total en productos</span>
        <span class="text-primary">{{ formatCurrency(cartStore.totalAmount) }}</span>
      </p>
      <p class="flex justify-between">
        <span class="text-secondary">Tarifa de entrega</span>
        <span class="text-primary">{{ formatCurrency(50) }}</span>
      </p>

      <hr class="border-t-2 border-[#898989]">

      <p class="flex justify-between items-center">
        <span class="text-secondary">Total</span>
        <span class="text-lg font-bold">{{ formatCurrency(cartStore.totalAmount + 50) }}</span>
      </p>
    </div>
  </UIFormSection>
</template>
