<script setup lang="ts">
interface Props {
  quantity: number
  canAddMore: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  increment: []
  decrement: []
}>()
</script>

<template>
  <div class="inline-flex items-center border border-gray-300 rounded-full h-12">
    <button
      class="w-12 h-12 flex items-center justify-center text-xl text-gray-700"
      :disabled="quantity <= 0"
      :class="{ 'opacity-30': quantity <= 0 }"
      @click="emit('decrement')"
    >
      <LucideMinus class="size-5" />
    </button>
    <span class="w-10 text-center text-lg font-semibold select-none">{{ quantity }}</span>
    <button
      class="w-12 h-12 flex items-center justify-center text-xl text-gray-700"
      :disabled="!canAddMore"
      :class="{ 'opacity-30': !canAddMore }"
      @click="emit('increment')"
    >
      <LucidePlus class="size-5" />
    </button>
  </div>
</template>
