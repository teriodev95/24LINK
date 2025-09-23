<script setup lang="ts">
const cartStore = useCartStore()
</script>

<template>
  <UIFormSection title="Productos">
    <div v-for="item in cartStore.cartItems" :key="item.productId" class="grid grid-cols-6 gap-2 text-center">
      <figure>
        <NuxtImg :src="item.product.imagen_url" height="72" />
      </figure>
      <span class="col-span-3 text-sm text-left">{{ item.product.nombre }}</span>
      <span>x {{ item.quantity }}</span>
      <span>{{ formatCurrency(item.product.precio * item.quantity) }}</span>
    </div>
  </UIFormSection>
</template>
