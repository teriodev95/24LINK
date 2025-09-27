<script setup lang="ts">

const productsStore = useProductsStore()

onBeforeMount(async () => {
  if (!productsStore.hasData) {
    await productsStore.fetchData()
  }
})
</script>

<template>
  <div class="py-4 bg-[#FFFFFF] max-w-6xl mx-auto ">
    <NuxtPage />
  </div>
</template>
