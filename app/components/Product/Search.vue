<script setup lang="ts">
const productsStore = useProductsStore()
const hasSearchQuery = computed(() => productsStore.searchQuery.length > 0);

</script>

<template>
  <section class="relative px-2">
    <input :value="productsStore.searchQuery" type="text" placeholder="Busca en 24HrsFiesta"
      class="w-full rounded-3xl text-center border border-[#1F2020] py-3 px-12 pr-12"
      @input="productsStore.setSearchQuery(($event.target as HTMLInputElement).value)">
    <lucide-search v-if="!hasSearchQuery"
      class="absolute right-8 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />

    <lucide-x v-else class="absolute right-8 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer"
      @click="productsStore.setSearchQuery('')" />
  </section>
</template>
