<script setup lang="ts">
interface Props {
  label: string
  role?: 'link' | 'button'
  variant?: 'primary' | 'secondary'
  className?: string
  disabled?: boolean
  to?: string
  type?: 'button' | 'submit'
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  className: '',
  to: '#',
  type: 'button',
  role: 'button',
  disabled: false
})

defineEmits<Emits>()

const variantClasses = computed(() => {
  const baseClasses = 'flex justify-center items-center gap-3 rounded-3xl w-44 h-12'

  const variants = {
    primary: 'bg-[#001954] hover:bg-[#002266] text-white',
    secondary: 'border border-[#001954] text-[#001954] hover:bg-[#E6E6E6] bg-white'
  }

  return `${baseClasses} ${variants[props.variant]} ${props.className}`
})
</script>

<template>
  <NuxtLink v-if="role === 'link'" :to="to" :class="variantClasses">
    <span>{{ label }}</span>
    <slot name="icon" />
  </NuxtLink>

  <button v-else :type="type" :class="variantClasses" :disabled="disabled" @click="$emit('click')">
    <span>{{ label }}</span>
    <slot name="icon" />
  </button>
</template>
