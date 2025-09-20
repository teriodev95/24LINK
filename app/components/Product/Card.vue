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
const maxStock = computed(() => props.product.stock)
const { quantity, setQuantity } = useProductQuantity(maxStock)
const { handleInteraction, stopTimer } = useAutoCollapse({
  timeout: 4000,
  onCollapse: () => props.isExpanded && emit('action:collapse')
})

const handleExpand = () => {
  emit('action:expand', props.product.id)
}

const handleQuantityUpdate = (newQuantity: number) => {
  setQuantity(newQuantity)
  if (props.isExpanded) {
    handleInteraction()
  }
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

    <ProductQuantityControl :quantity="quantity" :max-stock="product.stock" :is-expanded="isExpanded || false"
      @update:quantity="handleQuantityUpdate" @interaction="handleInteraction" @expand="handleExpand" />
  </div>
</template>
