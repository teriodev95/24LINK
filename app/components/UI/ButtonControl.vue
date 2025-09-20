<script setup lang="ts">
interface Emits {
  (e: 'click'): void
}

interface Props {
  disabled?: boolean
  variant?: 'increment' | 'decrement'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: 'increment'
})

const emit = defineEmits<Emits>()

const icon = computed(() => props.variant === 'increment' ? '+' : '-')
</script>

<template>
  <button
    class="text-xl w-6 h-6 flex items-center justify-center transition-colors"
    :class="{ 'text-gray-400': disabled }"
    :disabled="disabled"
    @click="emit('click')"
  >
    {{ icon }}
  </button>
</template>