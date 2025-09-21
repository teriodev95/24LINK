<script setup lang="ts">
import { useSupabaseApi } from '~/composables/useSupabaseApi';
import type { Product, Category } from '~/interfaces/product.interface';

const api = useSupabaseApi()
const selectedCategory = ref<Category>({
  id: 'all',
  nombre: 'Todas'
});
const searchQuery = ref<string>('');

const { data: categories, pending: categoriesPending, error: categoriesError } = await api.fetchLazy<Category[]>('/categorias?activa=eq.true&select=id,nombre', {
  key: 'categories'
})

const { data: products, pending: productsPending, error: productsError } = await api.fetchLazy<Product[]>('/productos?activo=eq.true&select=*', {
  key: 'products'
})

// Computed properties for better state management
const isLoading = computed(() => categoriesPending.value || productsPending.value);
const hasError = computed(() => categoriesError.value || productsError.value);
const hasData = computed(() => !!(categories.value && products.value));
const shouldShowAllProducts = computed(() => selectedCategory.value?.id === 'all');
const shouldShowFilteredProducts = computed(() =>
  hasData.value && selectedCategory.value && !shouldShowAllProducts.value
);
</script>

<template>
  <div class="h-screen relative">

    <BtnCart />

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <span class="text-gray-500">Cargando productos...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="hasError" class="flex justify-center items-center py-8">
      <span class="text-red-500">Error al cargar los datos</span>
    </div>

    <!-- Main content when data is available -->
    <div v-else-if="hasData" class="space-y-4">
      <ProductSearch v-model="searchQuery" />

      <CategoryFilter :category-list="categories!" :selected-category="selectedCategory"
        @action:select-category="(category) => selectedCategory = category" />

      <!-- Unified product list component -->
      <ProductList v-if="shouldShowAllProducts || shouldShowFilteredProducts" :products="products!"
        :categories="categories!" :selected-category="selectedCategory" :search-query="searchQuery"
        :group-by-category="shouldShowAllProducts" />

      <!-- No category selected state -->
      <div v-else class="flex justify-center items-center py-8">
        <span class="text-gray-500">Selecciona una categoría para ver los productos</span>
      </div>
    </div>
  </div>
</template>
