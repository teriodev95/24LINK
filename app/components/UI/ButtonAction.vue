<script setup lang="ts">
interface Props {
  label: string
  role?: 'link' | 'button'
  variant?: 'primary' | 'secondary'
  className?: string
  disabled?: boolean
  loading?: boolean
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
  disabled: false,
  loading: false
})

defineEmits<Emits>()

const variantClasses = computed(() => {
  const baseClasses = 'flex justify-center items-center gap-3 rounded-3xl w-44 h-12 transition-all'

  const variants = {
    primary: 'bg-[#001954] hover:bg-[#002266] text-white',
    secondary: 'border border-[#001954] text-[#001954] hover:bg-[#E6E6E6] bg-white'
  }

  const disabledClasses = (props.disabled || props.loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''

  return `${baseClasses} ${variants[props.variant]} ${props.className} ${disabledClasses}`
})
</script>

<template>
  <NuxtLink v-if="role === 'link'" :to="to" :class="variantClasses">
    <span>{{ label }}</span>
    <slot name="icon" />
  </NuxtLink>

  <button v-else :type="type" :class="variantClasses" :disabled="disabled || loading" @click="$emit('click')">
    <svg
      v-if="loading"
      class="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    <span>{{ loading ? 'Procesando...' : label }}</span>
    <slot v-if="!loading" name="icon" />
  </button>
</template>
