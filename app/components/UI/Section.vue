<script setup lang="ts">
interface Props {
  title?: string
}

defineProps<Props>()
</script>

<template>
  <section class="p-4 border border-[#E6E6E6] space-y-4 rounded-lg">
    <h2 v-if="title" class="text-primary">{{ title }}</h2>
    <slot />
  </section>
</template>