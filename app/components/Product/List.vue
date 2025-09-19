<script setup lang="ts">
import type { Category, Product } from '~/interfaces/product.interface';

interface Props {
  products: Product[];
  selectedCategory?: Category;
}

const $props = defineProps<Props>();

const filteredProducts = computed(() => {
  if ($props.selectedCategory?.id) {
    return $props.products.filter(product => product.categoria_id === $props.selectedCategory?.id);
  }
  return $props.products;
});

</script>

<template>
  <article class="p-4">
    <h1 class="text-lg font-bold text-[#2B2C2C]">{{ selectedCategory?.nombre }}</h1>
    <section class="grid grid-cols-3 gap-[10px]">
      <template v-for="product in filteredProducts" :key="product.id">
        <ProductCard :product="product" />
      </template>
    </section>
  </article>
</template>
