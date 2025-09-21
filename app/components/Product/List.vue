<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Category, Product } from '~/interfaces/product.interface';

interface Props {
  products: Product[];
  categories?: Category[];
  selectedCategory?: Category;
  searchQuery?: string;
  groupByCategory?: boolean;
}

const $props = defineProps<Props>();
const expandedProductId = ref<string | null>(null);

// Cache sorted categories to avoid re-sorting on every search
const sortedCategories = computed(() => {
  if (!$props.categories) return [];
  return [...$props.categories].sort((a, b) => a.nombre.localeCompare(b.nombre));
});

// Memoize filtered products by search query
const searchFilteredProducts = computed(() => {
  if (!$props.searchQuery?.trim()) return $props.products;

  const query = $props.searchQuery.toLowerCase().trim();
  return $props.products.filter(product =>
    product.nombre.toLowerCase().includes(query)
  );
});

// Group products by category with optimized logic
const groupedByCategory = computed(() => {
  if (!$props.groupByCategory || !sortedCategories.value.length) return [];

  const productsByCategory = new Map<string, Product[]>();

  // Single pass to group products by category
  for (const product of searchFilteredProducts.value) {
    const categoryId = product.categoria_id;
    if (!productsByCategory.has(categoryId)) {
      productsByCategory.set(categoryId, []);
    }
    productsByCategory.get(categoryId)!.push(product);
  }

  // Map sorted categories to groups, only including categories with products
  return sortedCategories.value
    .map(category => ({
      category,
      products: productsByCategory.get(category.id) || []
    }))
    .filter(group => group.products.length > 0);
});

// Filter products for single category view
const filteredProducts = computed(() => {
  let products = searchFilteredProducts.value;

  if ($props.selectedCategory?.id && $props.selectedCategory.id !== 'all') {
    products = products.filter(product => product.categoria_id === $props.selectedCategory?.id);
  }

  return products;
});

const processedData = computed(() => {
  if ($props.groupByCategory) {
    return { type: 'grouped' as const, data: groupedByCategory.value };
  } else {
    return { type: 'filtered' as const, data: filteredProducts.value };
  }
});

const handleExpand = (productId: string) => {
  expandedProductId.value = productId;
};

const handleCollapse = () => {
  expandedProductId.value = null;
};

watch(() => $props.selectedCategory, () => {
  handleCollapse();
});

</script>

<template>
  <!-- Grouped by categories -->
  <div v-if="processedData.type === 'grouped'" class="space-y-3 px-6">
    <EmptyState v-if="processedData.data.length === 0">
      <template #icon>
        <LucideCircleSlash2 :size="48" />
      </template>
    </EmptyState>
    <article v-for="group in processedData.data" :key="group.category.id">
      <h2 class="text-lg font-bold text-[#2B2C2C] mb-1">{{ group.category.nombre }}</h2>
      <section class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-[10px]">
        <template v-for="product in group.products" :key="product.id">
          <ProductCard :product="product" :is-expanded="expandedProductId === product.id" @action:expand="handleExpand"
            @action:collapse="handleCollapse" />
        </template>
      </section>
    </article>
  </div>

  <!-- Filtered by category -->
  <article v-else class="px-6">
    <h1 v-if="selectedCategory?.nombre" class="text-lg font-bold text-[#2B2C2C] mb-1">
      {{ selectedCategory.nombre }}
    </h1>
    <EmptyState v-if="processedData.data.length === 0">
      <template #icon>
        <LucideCircleSlash2 :size="48" />
      </template>
    </EmptyState>
    <section v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-[10px]">
      <template v-for="product in processedData.data" :key="product.id">
        <ProductCard :product="product" :is-expanded="expandedProductId === product.id" @action:expand="handleExpand"
          @action:collapse="handleCollapse" />
      </template>
    </section>
  </article>
</template>
