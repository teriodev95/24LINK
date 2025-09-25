<script setup lang="ts">

const productsStore = useProductsStore()
const cartStore = useCartStore()

await productsStore.fetchData()

const hasItems = computed(() => cartStore.totalItems > 0)
const label = computed(() => {
  const count = cartStore.totalItems
  return count === 1 ? '1 Producto' : `${count} Productos`
})
</script>

<template>
  <div class="h-screen relative">
    <UIButtonAction v-if="hasItems" type="link" :label="label" to="/detalles-orden"
      class-name="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" />

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
