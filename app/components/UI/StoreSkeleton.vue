<template>
  <div class="animate-pulse">
    <!-- Header skeleton -->
    <div class="px-5 pt-2 pb-1">
      <div class="h-5 w-20 bg-gray-200 rounded-lg" />
      <div class="h-3 w-36 bg-gray-100 rounded-lg mt-1.5" />
    </div>

    <!-- Category pills skeleton -->
    <div class="flex gap-2 px-5 py-2 overflow-hidden">
      <div v-for="i in 6" :key="i" class="h-8 rounded-full bg-gray-200 shrink-0" :style="{ width: `${50 + (i % 3) * 20}px` }" />
    </div>

    <!-- Product grid skeleton -->
    <div class="px-5 mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
      <div v-for="i in 12" :key="i" class="space-y-1.5">
        <div class="aspect-square w-full rounded-xl bg-gray-200" />
        <div class="h-3 w-full bg-gray-200 rounded" />
        <div class="h-3 w-2/3 bg-gray-100 rounded" />
      </div>
    </div>
  </div>
</template>
