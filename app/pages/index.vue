<script setup lang="ts">
import type { Product } from '~/interfaces/product.interface';



const config = useRuntimeConfig()

const categoryList = ['Cerveza', 'Books', 'Clothing', 'Home & Kitchen', 'Sports', 'Toys'];
const selectedCategory = ref<string>('');
const { data: products, pending, error } = await useFetch<Product[]>('/productos', {
  baseURL: 'https://db.el24.cc/rest/v1',
  query: {
    activo: 'eq.true',
    select: '*'
  },
  headers: {
    'apikey': config.public.supabaseApiKey,
    'Authorization': `Bearer ${config.supabaseAuthToken || config.public.supabaseApiKey}`,
    'Content-Type': 'application/json'
  },
  key: 'products',
  lazy: true
})
</script>

<template>
  <div>
    <CategoryFilter :category-list="categoryList" :selected-category="selectedCategory"
      @action:select-category="(category) => { selectedCategory = category; }" />
    <ProductList v-if="products" :products="products" />
  </div>
</template>
