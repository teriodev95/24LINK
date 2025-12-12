<script setup lang="ts">
const productsStore = useProductsStore()
const { expandedProductId, expand, collapse } = useProductExpansion()

watch(() => productsStore.selectedCategory, collapse)
</script>

<template>
  <!-- Grouped by categories -->
  <div v-if="productsStore.processedData.type === 'grouped'" class="space-y-3 px-6">
    <UIEmptyState v-if="productsStore.processedData.data.length === 0">
      <template #icon>
        <LucideCircleSlash2 :size="48" />
      </template>
    </UIEmptyState>
    <article v-for="group in productsStore.processedData.data" :key="group.category.id">
      <h2 class="text-lg font-bold text-[#2B2C2C] mb-1">{{ group.category.nombre }}</h2>
      <ProductGrid :products="group.products" :expanded-product-id="expandedProductId" @action:expand="expand"
        @action:collapse="collapse" />
    </article>
  </div>

  <!-- Filtered by category -->
  <article v-else class="px-6">
    <h1 v-if="productsStore.selectedCategory?.nombre" class="text-lg font-bold text-[#2B2C2C] mb-1">
      {{ productsStore.selectedCategory.nombre }}
    </h1>
    <UIEmptyState v-if="productsStore.processedData.data.length === 0">
      <template #icon>
        <LucideCircleSlash2 :size="48" />
      </template>
    </UIEmptyState>
    <ProductGrid v-else :products="productsStore.processedData.data" :expanded-product-id="expandedProductId"
      @action:expand="expand" @action:collapse="collapse" />
  </article>
</template>
