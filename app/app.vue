<script setup lang="ts">

const productsStore = useProductsStore()

onMounted(async () => {
  if (!productsStore.hasData) {
    await productsStore.fetchData()
  }
})
</script>

<template>
  <div class="p-2  bg-[#FFFFFF] max-w-6xl mx-auto ">
    <NuxtPage />
  </div>
</template>
