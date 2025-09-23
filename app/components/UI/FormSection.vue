<template>
  <section class="p-4 border space-y-4 rounded-lg">
    <h2 class="text-primary">{{ title }}</h2>
    <slot />
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>