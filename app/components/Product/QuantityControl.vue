<script setup lang="ts">
import type { Product } from '~/interfaces/product.interface'

interface Props {
  product: Product
  isExpanded: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  interaction: []
  expand: []
}>()

const productRef = toRef(props, 'product')
const { quantity, hasProductInCart, canAddMore, increment, decrement, setQuantity } = useProductCart(productRef)
const { isEditing, tempValue, inputRef, startEdit, saveEdit, cancelEdit } = useInlineEdit(
  quantity,
  (newQuantity: number) => setQuantity(newQuantity)
)

const handleInteraction = () => emit('interaction')

const handleStartEdit = () => {
  startEdit()
  handleInteraction()
}

const handleInput = () => {
  handleInteraction()
}

const handleIncrement = () => {
  increment()
  handleInteraction()
}

const handleDecrement = () => {
  decrement()
  handleInteraction()
}
</script>

<template>
  <div class="absolute right-0 top-0" :class="{ 'left-0': isExpanded }">
    <!-- Collapsed state -->
    <button v-if="!isExpanded"
      class="rounded-full bg-white size-8 shadow-[0_5px_15px_0_rgba(0,0,0,0.15)] flex items-center justify-center"
      :class="[hasProductInCart ? 'text-sm' : 'text-2xl']" @click="emit('expand')">
      {{ hasProductInCart ? quantity : '+' }}
    </button>

    <!-- Expanded state -->
    <div v-else class="bg-white rounded-full shadow-[0_5px_15px_0_rgba(0,0,0,0.15)] flex items-center h-8 px-2">
      <UIQuantityButton variant="decrement" :disabled="quantity === 0" @click="handleDecrement" />

      <!-- Inline edit input -->
      <input v-if="isEditing" ref="inputRef" v-model.number="tempValue" type="number" :min="0" :max="product.stock"
        step="1" class="px-2 text-sm font-medium flex-1 text-center bg-transparent border-none outline-none w-8"
        @blur="saveEdit" @keydown.enter="saveEdit" @keydown.escape="cancelEdit" @input="handleInput"
        @keydown="handleInteraction" @focus="handleInteraction">

      <!-- Display quantity -->
      <span v-else class="px-2 text-sm font-medium flex-1 text-center cursor-pointer" @click="handleStartEdit">
        {{ quantity }}
      </span>

      <UIQuantityButton variant="increment" :disabled="!canAddMore" @click="handleIncrement" />
    </div>
  </div>
</template>