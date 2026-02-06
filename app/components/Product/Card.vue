<script setup lang="ts">
import type { Product } from '~/interfaces/product.interface'
import formatCurrency from '~/utils/formatCurrency'

interface Emits {
  (e: 'action:expand', productId: string): void
  (e: 'action:collapse'): void
}

interface Props {
  product: Product
  isExpanded?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Composables
const { handleInteraction, stopTimer } = useAutoCollapse({
  timeout: 4000,
  onCollapse: () => props.isExpanded && emit('action:collapse')
})


const handleExpand = () => {
  emit('action:expand', props.product.id)
}

// Watchers
watch(() => props.isExpanded, (newExpanded) => {
  if (newExpanded) {
    handleInteraction()
  } else {
    stopTimer()
  }
})
</script>

<template>
  <div class="relative">
    <NuxtLink :to="`/producto/${product.id}`" class="block space-y-1.5">
      <ProductImage :src="product.imagen_url" :alt="product.nombre" />
      <div>
        <p class="text-[12px] font-medium text-[#001954] leading-tight line-clamp-2">{{ product.nombre }}</p>
        <p class="text-[12px] text-gray-400 mt-0.5">MXN {{ formatCurrency(product.precio) }}</p>
      </div>
    </NuxtLink>

    <ClientOnly>
      <ProductQuantityControl :product="product" :is-expanded="isExpanded || false" @interaction="handleInteraction"
        @expand="handleExpand" />
    </ClientOnly>
  </div>
</template>
