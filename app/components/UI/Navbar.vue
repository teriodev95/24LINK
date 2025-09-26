<script setup lang="ts">
interface Props {
  title: string
  to: string
}

defineProps<Props>()
</script>
<template>
  <nav class="flex justify-between gap-2">
    <NuxtLink :to="to" class="cursor-pointer">
      <LucideChevronLeft />
    </NuxtLink>
    <span class="text-primary">{{ title }}</span>
    <span />
  </nav>
</template>
