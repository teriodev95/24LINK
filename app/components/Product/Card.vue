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
  <div class="space-y-1 text-sm font-normal relative">
    <figure class="size-[94px] relative overflow-hidden rounded-md">
      <div v-if="!imageLoaded" class="absolute inset-0 bg-gray-200 animate-pulse" />
      <NuxtImg :src="product.imagen_url || '/img/beer.jpg'" :alt="product.nombre"
        :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }" width="94" height="94"
        class="w-full h-full object-cover transition-opacity duration-300" loading="lazy" @load="imageLoaded = true"
        @error="imageLoaded = true" />
    </figure>

    <p>{{ product.nombre }}</p>

    <p class="text-[#717272]">MXM {{ formatCurrency(product.precio) }}</p>


    <button
      class="rounded-full text-2xl bg-white size-8 absolute right-0 top-0 shadow-[0_5px_15px_0_rgba(0,0,0,0.15)] ">
      +
    </button>
  </div>
</template>
