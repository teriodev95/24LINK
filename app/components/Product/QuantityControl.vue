<script setup lang="ts">
interface Emits {
  (e: 'update:quantity', value: number): void
  (e: 'interaction' | 'expand'): void
}

interface Props {
  quantity: number
  maxStock: number
  isExpanded: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Composable consolidado
const maxStock = computed(() => props.maxStock)
const { quantityInput, isEditing, tempQuantity, hasProductInCart, canAddMore, startEdit, saveEdit, cancelEdit, handleInput } =
  useProductQuantity(maxStock)

// Handlers simplificados
const onStartEdit = () => startEdit(() => emit('interaction'))
const onSaveEdit = () => saveEdit((value) => emit('update:quantity', value))
const onHandleInput = () => handleInput(() => emit('interaction'))

const increment = () => {
  if (props.quantity < props.maxStock) {
    emit('update:quantity', props.quantity + 1)
    emit('interaction')
  }
}

const decrement = () => {
  if (props.quantity > 0) {
    emit('update:quantity', props.quantity - 1)
    emit('interaction')
  }
}

</script>

<template>
  <div class="absolute right-0 top-0" :class="{ 'left-0': isExpanded }">
    <button v-if="!isExpanded"
      class="rounded-full bg-white size-8 shadow-[0_5px_15px_0_rgba(0,0,0,0.15)] flex items-center justify-center"
      :class="[hasProductInCart ? 'text-sm' : 'text-2xl']" @click="emit('expand')">
      {{ hasProductInCart ? quantity : '+' }}
    </button>

    <div v-else class="bg-white rounded-full shadow-[0_5px_15px_0_rgba(0,0,0,0.15)] flex items-center h-8 px-2">
      <UIButtonControl variant="decrement" :disabled="quantity === 0" @click="decrement" />

      <input v-if="isEditing" ref="quantityInput" v-model.number="tempQuantity" type="number" :min="0" :max="maxStock"
        step="1" class="px-2 text-sm font-medium flex-1 text-center bg-transparent border-none outline-none w-8"
        @blur="onSaveEdit" @keydown.enter="onSaveEdit" @keydown.escape="cancelEdit" @input="onHandleInput"
        @keydown="emit('interaction')" @focus="emit('interaction')">

      <span v-else class="px-2 text-sm font-medium flex-1 text-center cursor-pointer" @click="onStartEdit">
        {{ quantity }}
      </span>

      <UIButtonControl variant="increment" :disabled="!canAddMore" @click="increment" />
    </div>
  </div>
</template>