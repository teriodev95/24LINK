<script setup lang="ts">
import type { Product } from '~/interfaces/product.interface'

interface Props {
  products: Product[]
  expandedProductId: string | null
}

interface Emits {
  (e: 'action:expand', productId: string): void
  (e: 'action:collapse'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <section class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
    <template v-for="(product, index) in products" :key="product.id">
      <div 
        class="animate-fade-in-up fill-mode-forwards" 
        :style="{ animationDelay: `${index * 40}ms` }"
      >
        <ProductCard 
          :product="product" 
          :is-expanded="expandedProductId === product.id"
          @action:expand="$emit('action:expand', $event)" 
          @action:collapse="$emit('action:collapse')" 
        />
      </div>
    </template>
  </section>
</template>

<style scoped>
.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.fill-mode-forwards {
  animation-fill-mode: forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
