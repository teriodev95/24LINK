<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Category, Product } from '~/interfaces/product.interface';

interface Props {
  products: Product[];
  categorys: Category[];
  searchQuery?: string;
}

const $props = defineProps<Props>();
const expandedProductId = ref<string | null>(null);

const groupedProducts = computed(() => {
  let products = $props.products;

  // Filter by search query first
  if ($props.searchQuery?.trim()) {
    const query = $props.searchQuery.toLowerCase().trim();
    products = products.filter(product =>
      product.nombre.toLowerCase().includes(query)
    );
  }

  // Group products by category
  const grouped = $props.categorys.map(category => {
    const categoryProducts = products.filter(product => product.categoria_id === category.id);
    return {
      category,
      products: categoryProducts
    };
  }).filter(group => group.products.length > 0); // Only show categories with products

  return grouped;
});

const handleExpand = (productId: string) => {
  expandedProductId.value = productId;
};

const handleCollapse = () => {
  expandedProductId.value = null;
};

</script>

<template>
  <div class="space-y-6">
    <article v-for="group in groupedProducts" :key="group.category.id" class="p-4">
      <h2 class="text-lg font-bold text-[#2B2C2C] mb-4">{{ group.category.nombre }}</h2>
      <section class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-[10px]">
        <template v-for="product in group.products" :key="product.id">
          <ProductCard :product="product" :is-expanded="expandedProductId === product.id" @action:expand="handleExpand"
            @action:collapse="handleCollapse" />
        </template>
      </section>
    </article>
  </div>
</template>
