<script setup lang="ts">
const productsStore = useProductsStore()
const cartStore = useCartStore()
const { isAuthenticated } = useAuth()
const { userOrders: orders, isLoading: isLoadingOrders, loadUserOrders } = useOrderApi()

const hasItems = computed(() => cartStore.totalItems > 0)
const label = computed(() => {
  const count = cartStore.totalItems
  return count === 1 ? '1 Producto' : `${count} Productos`
})

// Determinar a dónde redirigir cuando el usuario quiere ver el carrito
const checkoutUrl = computed(() => {
  return isAuthenticated.value ? '/detalles-orden' : '/verificacion'
})

await productsStore.fetchData()
await loadUserOrders()
</script>

<template>
  <div class="min-h-screen relative pb-12">
    <ClientOnly class="fixed bottom-4 right-4 left-4 z-50">
      <UIButtonAction v-if="hasItems" role="link" :label="label" :to="checkoutUrl" class-name="mx-auto">
        <template #icon>
          <LucideShoppingCart class="w-5 h-5" />
        </template>
      </UIButtonAction>
    </ClientOnly>

    <!-- Loading state -->
    <div v-if="productsStore.isLoading" class="flex justify-center items-center py-8">
      <UILoading :size="120" />
    </div>
    <!-- Error state -->
    <div v-else-if="productsStore.error" class="flex justify-center items-center py-8">
      <span class="text-red-500">{{ productsStore.error }}</span>
    </div>

    <!-- Main content when data is available -->
    <div v-else-if="productsStore.hasData" class="space-y-4">
      <ProductSearch />

      <!-- Orders list - Solo mostrar si hay usuario autenticado -->
      <ClientOnly>
        <OrderList v-if="isAuthenticated" :orders="orders" :is-loading="isLoadingOrders" />
      </ClientOnly>

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
