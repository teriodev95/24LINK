<script setup lang="ts">
const cartStore = useCartStore()
</script>

<template>
  <section class="p-4 border space-y-4 rounded-lg">
    <h2 class="text-[#001954] font-bold">Productos</h2>

    <div class="space-y-2">
      <div v-for="item in cartStore.cartItems" :key="item.productId" class="grid grid-cols-6 gap-2 text-center">
        <figure>
          <NuxtImg :src="item.product.imagen_url" height="72" />
        </figure>
        <span class="col-span-3 text-sm text-left">{{ item.product.nombre }}</span>
        <span>x {{ item.quantity }}</span>
        <span>{{ formatCurrency(item.product.precio * item.quantity) }}</span>
      </div>
    </div>
  </section>
</template>
