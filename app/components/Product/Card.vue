<script setup lang="ts">
import { ref } from 'vue';
import type { Product } from '~/interfaces/product.interface';

interface Props {
  product: Product
}

defineProps<Props>();

const imageLoaded = ref(false);
</script>

<template>
  <div class="space-y-1 text-sm font-normal">
    <figure class="size-24 relative overflow-hidden rounded-md">
      <div v-if="!imageLoaded" class="absolute inset-0 bg-gray-200 animate-pulse" />
      <img :src="product.imagen_url" :alt="product.nombre"
        :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
        class="w-full h-full object-cover transition-opacity duration-300" @load="imageLoaded = true"
        @error="imageLoaded = true">
    </figure>

    <p>{{ product.nombre }}</p>

    <p class="text-[#717272]">{{ product.precio }}</p>
  </div>
</template>
