<script setup lang="ts">
const cartStore = useCartStore()
</script>

<template>
  <UIFormSection title="Productos">
    <div v-for="producto in cartStore.cartItems" :key="producto.id"
      class="grid grid-cols-7 items-center gap-2 text-center">
      <figure>
        <NuxtImg :src="producto.imagen_url" height="72" />
      </figure>
      <span class="col-span-3 text-sm text-left">{{ producto.nombre }}</span>
      <span>x {{ producto.cantidad }}</span>
      <span class="text-primary col-span-2">{{ formatCurrency(producto.precio_unitario * producto.cantidad) }}</span>
    </div>
  </UIFormSection>
</template>
