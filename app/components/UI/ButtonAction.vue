<script setup lang="ts">
interface Props {
  label: string
  type: 'link' | 'button'
  className?: string
  to?: string
}

defineProps<Props>()
// 
</script>

<template>
  <NuxtLink v-if="type === 'link'" :to="to"
    class="flex justify-center items-center gap-3 bg-[#001954] rounded-3xl w-44 h-12 text-white" :class="className">
    <span>{{ label }}</span>
    <slot name="icon">
      <lucide-shopping-cart />
    </slot>
  </NuxtLink>

  <button v-else class="flex justify-center items-center gap-3 bg-[#001954] rounded-3xl w-44 h-12 text-white"
    :class="className">
    <span>{{ label }}</span>
    <slot name="icon">
      <lucide-shopping-cart />
    </slot>
  </button>
</template>
