<script setup lang="ts">
import type { Product } from '~/interfaces/product.interface'
import { useCartStore } from '~/stores/cart';

interface Emits {
  (e: 'interaction' | 'expand'): void
}

interface Props {
  product: Product
  isExpanded: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Cart store
const cartStore = useCartStore()

// Estado local para edición
const quantityInput = ref<HTMLInputElement>()
const isEditing = ref(false)
const tempQuantity = ref(0)

// Computed properties
const quantity = computed(() => cartStore.getQuantity(props.product.id))
const hasProductInCart = computed(() => cartStore.hasProductInCart(props.product.id))
const canAddMore = computed(() => cartStore.canAddMore(props.product))

// Handlers
const startEdit = () => {
  isEditing.value = true
  tempQuantity.value = quantity.value
  emit('interaction')
  nextTick(() => {
    quantityInput.value?.focus()
    quantityInput.value?.select()
  })
}

const saveEdit = () => {
  if (tempQuantity.value >= 0 && tempQuantity.value <= props.product.stock) {
    cartStore.setQuantity(props.product, tempQuantity.value)
  }
  isEditing.value = false
}

const cancelEdit = () => {
  tempQuantity.value = quantity.value
  isEditing.value = false
}

const handleInput = () => {
  emit('interaction')
}

const increment = () => {
  cartStore.incrementQuantity(props.product)
  emit('interaction')
}

const decrement = () => {
  cartStore.decrementQuantity(props.product.id)
  emit('interaction')
}

</script>

<template>
  <div class="absolute right-0 top-0" :class="{ 'left-0': isExpanded }">
    {{ quantity }}
    <button v-if="!isExpanded"
      class="rounded-full bg-white size-8 shadow-[0_5px_15px_0_rgba(0,0,0,0.15)] flex items-center justify-center"
      :class="[hasProductInCart ? 'text-sm' : 'text-2xl']" @click="emit('expand')">
      {{ hasProductInCart ? quantity : '+' }}
    </button>

    <div v-else class="bg-white rounded-full shadow-[0_5px_15px_0_rgba(0,0,0,0.15)] flex items-center h-8 px-2">
      <UIButtonControl variant="decrement" :disabled="quantity === 0" @click="decrement" />

      <input v-if="isEditing" ref="quantityInput" v-model.number="tempQuantity" type="number" :min="0"
        :max="props.product.stock" step="1"
        class="px-2 text-sm font-medium flex-1 text-center bg-transparent border-none outline-none w-8" @blur="saveEdit"
        @keydown.enter="saveEdit" @keydown.escape="cancelEdit" @input="handleInput" @keydown="emit('interaction')"
        @focus="emit('interaction')">

      <span v-else class="px-2 text-sm font-medium flex-1 text-center cursor-pointer" @click="startEdit">
        {{ quantity }}
      </span>

      <UIButtonControl variant="increment" :disabled="!canAddMore" @click="increment" />
    </div>
  </div>
</template>