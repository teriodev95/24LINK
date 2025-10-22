<script setup lang="ts">
interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  fallbackSrc?: string
}

withDefaults(defineProps<Props>(), {
  width: 94,
  height: 94,
  fallbackSrc: '/img/beer.jpg'
})

const imageLoaded = ref(false)
</script>

<template>
  <figure class="size-[94px] relative overflow-hidden rounded-md">
    <div v-if="!imageLoaded" class="absolute inset-0 bg-gray-200 animate-pulse" />
    <img :src="src || fallbackSrc" :alt="alt" :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
      :width="width" :height="height" class="w-full h-full object-cover transition-opacity duration-300" loading="lazy"
      @load="imageLoaded = true" @error="imageLoaded = true" />
  </figure>
</template>