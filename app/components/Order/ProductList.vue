<script setup lang="ts">
import type { CartProduct } from '~/interfaces';

interface Props {
  products: CartProduct[]
}

defineProps<Props>()
</script>

<template>
  <UISection title="Productos">
    <div v-for="product in products" :key="product.id" class="grid grid-cols-7 items-center gap-2 text-center">
      <figure>
        <NuxtImg :src="product.imagen_url" height="72" />
      </figure>
      <span class="col-span-3 text-sm text-left">{{ product.nombre }}</span>
      <span>x {{ product.cantidad }}</span>
      <span class="text-primary col-span-2">{{ formatCurrency(product.precio_unitario * product.cantidad) }}</span>
    </div>
  </UISection>
</template>
