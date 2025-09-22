<script setup lang="ts">
import type { Product } from '~/interfaces/product.interface'

interface Props {
  products: Product[]
  expandedProductId: string | null
}

defineProps<Props>()
defineEmits<{
  'action:expand': [productId: string]
  'action:collapse': []
}>()
</script>

<template>
  <section class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-[10px]">
    <template v-for="product in products" :key="product.id">
      <ProductCard
        :product="product"
        :is-expanded="expandedProductId === product.id"
        @action:expand="$emit('action:expand', $event)"
        @action:collapse="$emit('action:collapse')"
      />
    </template>
  </section>
</template>