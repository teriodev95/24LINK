<script setup lang="ts">
interface Props {
  variant: 'increment' | 'decrement'
  disabled?: boolean
}

interface Emits {
  (e: 'click'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <button :disabled="disabled" class="w-6 h-6 rounded-full flex items-center justify-center transition-colors" :class="{
    'bg-gray-100 hover:bg-gray-200': !disabled,
    'bg-gray-50 text-gray-300 cursor-not-allowed': disabled
  }" @click="$emit('click')">
    <span class="text-xs font-bold">
      {{ variant === 'increment' ? '+' : '−' }}
    </span>
  </button>
</template>