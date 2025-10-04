<script setup lang="ts">
import { Toaster } from 'vue-sonner'

const productsStore = useProductsStore()

onMounted(async () => {
  if (!productsStore.hasData) {
    await productsStore.fetchData()
  }
})
</script>

<template>
  <div class="p-2  bg-[#FFFFFF] max-w-6xl mx-auto ">
    <Toaster position="top-center" richColors />
    <NuxtPage />
  </div>
</template>
