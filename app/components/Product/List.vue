<script setup lang="ts">
import type { Product } from '~/interfaces/product.interface';

interface Props {
  products: Product[];
}

defineProps<Props>();

</script>

<template>
  <section class="grid grid-cols-3 gap-4 p-4">
    <template v-for="product in products" :key="product.id">
      <ProductCard :product="product" />
    </template>
  </section>
</template>
