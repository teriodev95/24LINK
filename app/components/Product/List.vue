<script setup lang="ts">
import { ref } from 'vue';
import type { Category, Product } from '~/interfaces/product.interface';

interface Props {
  products: Product[];
  selectedCategory?: Category;
}

const $props = defineProps<Props>();

const expandedProductId = ref<string | null>(null);

const filteredProducts = computed(() => {
  if ($props.selectedCategory?.id) {
    return $props.products.filter(product => product.categoria_id === $props.selectedCategory?.id);
  }
  return $props.products;
});

const handleExpand = (productId: string) => {
  expandedProductId.value = productId;
};

const handleCollapse = () => {
  expandedProductId.value = null;
};

</script>

<template>
  <article class="p-4">
    <h1 class="text-lg font-bold text-[#2B2C2C]">{{ selectedCategory?.nombre }}</h1>
    <section class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-[10px]">
      <template v-for="product in filteredProducts" :key="product.id">
        <ProductCard :product="product" :is-expanded="expandedProductId === product.id" @action:expand="handleExpand" @action:collapse="handleCollapse" />
      </template>
    </section>
  </article>
</template>
