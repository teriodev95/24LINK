<script setup lang="ts">
interface Props {
  tooltipContent: string
}

defineProps<Props>()
</script>

<template>
  <div class="absolute pointer-events-none z-20" style="left: 50%; top: 50%; transform: translate(-50%, -50%);">
    <!-- Static Center Marker -->
    <div class="relative">
      <!-- Marker Pin -->
      <div class="text-6xl flex items-end justify-center transform -translate-y-[30px]">
        📍
      </div>
      <!-- Tooltip -->
      <div
        class="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
      >
        {{ tooltipContent }}
      </div>
    </div>
  </div>
</template>