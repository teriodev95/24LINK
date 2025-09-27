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
  <div class="space-y-1 text-sm font-normal relative">
    <ProductImage :src="product.imagen_url" :alt="product.nombre" />

    <p>{{ product.nombre }}</p>
    <p class="text-[#717272]">MXM {{ formatCurrency(product.precio) }}</p>

    <ClientOnly>
      <ProductQuantityControl :product="product" :is-expanded="isExpanded || false" @interaction="handleInteraction"
        @expand="handleExpand" />
    </ClientOnly>
  </div>
</template>
