<script setup lang="ts">
const productsStore = useProductsStore()
const { expandedProductId, expand, collapse } = useProductExpansion()

watch(() => productsStore.selectedCategory, collapse)
</script>

<template>
  <!-- Grouped by categories -->
  <div v-if="productsStore.processedData.type === 'grouped'" class="space-y-5 px-5">
    <UIEmptyState v-if="productsStore.processedData.data.length === 0">
      <template #icon>
        <Icon name="lucide:circle-slash-2" size="48" />
      </template>
    </UIEmptyState>
    <article v-for="group in productsStore.processedData.data" :key="group.category.id">
      <h2 class="text-[15px] font-bold text-[#001954] mb-2">{{ group.category.nombre }}</h2>
      <ProductGrid :products="group.products" :expanded-product-id="expandedProductId" @action:expand="expand"
        @action:collapse="collapse" />
    </article>
  </div>

  <!-- Filtered by category -->
  <article v-else class="px-5">
    <h2 v-if="productsStore.selectedCategory?.nombre" class="text-[15px] font-bold text-[#001954] mb-2">
      {{ productsStore.selectedCategory.nombre }}
    </h2>
    <UIEmptyState v-if="productsStore.processedData.data.length === 0">
      <template #icon>
        <Icon name="lucide:circle-slash-2" size="48" />
      </template>
    </UIEmptyState>
    <ProductGrid v-else :products="productsStore.processedData.data" :expanded-product-id="expandedProductId"
      @action:expand="expand" @action:collapse="collapse" />
  </article>
</template>
