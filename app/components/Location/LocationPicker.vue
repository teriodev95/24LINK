<script setup lang="ts">
interface Props {
  tooltipContent: string
}

defineProps<Props>()
</script>

<template>
  <div class="absolute pointer-events-none z-20" style="left: 50%; top: 50%; transform: translate(-50%, -50%);">
    <div class="relative">
      <div class="text-6xl flex items-end justify-center transform -translate-y-[30px]">
        📍
      </div>
    </div>
  </div>
</template>