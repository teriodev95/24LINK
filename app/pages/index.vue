<script setup lang="ts">
const productsStore = useProductsStore()

await productsStore.fetchData()
</script>

<template>
  <div class="h-screen relative">

    <BtnCart />

    <!-- Loading state -->
    <div v-if="productsStore.isLoading" class="flex justify-center items-center py-8">
      <span class="text-gray-500">Cargando productos...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="productsStore.error" class="flex justify-center items-center py-8">
      <span class="text-red-500">{{ productsStore.error }}</span>
    </div>

    <!-- Main content when data is available -->
    <div v-else-if="productsStore.hasData" class="space-y-4">
      <ProductSearch />

      <CategoryFilter :category-list="productsStore.categories" :selected-category="productsStore.selectedCategory" />

      <!-- Unified product list component -->
      <ProductList v-if="productsStore.shouldShowAllProducts || productsStore.shouldShowFilteredProducts" />

      <!-- No category selected state -->
      <div v-else class="flex justify-center items-center py-8">
        <span class="text-gray-500">Selecciona una categoría para ver los productos</span>
      </div>
    </div>
  </div>
</template>
