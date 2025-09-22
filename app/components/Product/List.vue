<script setup lang="ts">
import { ref, watch } from 'vue';
import { useProductFiltering } from '~/composables/useProductFiltering';
import type { Category, Product } from '~/interfaces/product.interface';

interface Props {
  products: Product[];
  categories?: Category[];
  selectedCategory?: Category;
  searchQuery?: string;
  groupByCategory?: boolean;
}

const props = defineProps<Props>();
const expandedProductId = ref<string | null>(null);

const { processedData } = useProductFiltering({
  products: props.products,
  categories: props.categories,
  selectedCategory: props.selectedCategory,
  searchQuery: props.searchQuery,
  groupByCategory: props.groupByCategory
});

const handleExpand = (productId: string) => {
  expandedProductId.value = productId;
};

const handleCollapse = () => {
  expandedProductId.value = null;
};

watch(() => props.selectedCategory, () => {
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
          <ProductCard
            :product="product"
            :is-expanded="expandedProductId === product.id"
            @action:expand="handleExpand"
            @action:collapse="handleCollapse"
          />
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
        <ProductCard
          :product="product"
          :is-expanded="expandedProductId === product.id"
          @action:expand="handleExpand"
          @action:collapse="handleCollapse"
        />
      </template>
    </section>
  </article>
</template>
