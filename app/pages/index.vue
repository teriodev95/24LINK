<script setup lang="ts">
import { useSupabaseApi } from '~/composables/useSupabaseApi';
import type { Product, Category } from '~/interfaces/product.interface';

const api = useSupabaseApi()
const selectedCategory = ref<Category>();

const { data: categories, pending: _categoriesPending, error: _categoriesError } = await api.fetchLazy<Category[]>('/categorias?activa=eq.true&select=id,nombre', {
  key: 'categories'
})

const { data: products, pending: _pending, error: _error } = await api.fetchLazy<Product[]>('/productos?activo=eq.true&select=*', {
  key: 'products'
})
</script>

<template>
  <div>
    <CategoryFilter v-if="categories" :category-list="categories" :selected-category="selectedCategory"
      @action:select-category="(category) => selectedCategory = category" />
    <ProductList v-if="products" :products="products" :selected-category="selectedCategory" />
  </div>
</template>
