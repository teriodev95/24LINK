<script setup lang="ts">
import type { Category } from '~/interfaces/product.interface';

interface Props {
  categoryList: Category[]
  selectedCategory?: Category
}

const props = defineProps<Props>()
const productsStore = useProductsStore()

const sortedCategories = computed(() => {
  return [...props.categoryList].sort((a, b) => a.nombre.localeCompare(b.nombre));
});

const selectCategory = (category: Category) => {
  productsStore.setSelectedCategory(category)
}
</script>

<template>
  <section class="flex gap-2 overflow-x-auto py-2 px-5 scrollbar-hide">
    <button
      class="rounded-full px-4 h-9 text-[12px] font-semibold cursor-pointer whitespace-nowrap transition-all duration-150 active:scale-[0.97] shrink-0"
      :class="selectedCategory?.id === 'all'
        ? 'bg-[#001954] text-white shadow-[0_2px_10px_rgba(0,25,84,0.25)]'
        : 'bg-gray-100 text-[#001954]'"
      @click="selectCategory({ id: 'all', nombre: 'Todas' })"
    >
      Todas
    </button>
    <button
      v-for="(category, index) in sortedCategories"
      :key="index"
      class="rounded-full px-4 h-9 text-[12px] font-semibold cursor-pointer whitespace-nowrap transition-all duration-150 active:scale-[0.97] shrink-0"
      :class="selectedCategory?.id === category.id
        ? 'bg-[#001954] text-white shadow-[0_2px_10px_rgba(0,25,84,0.25)]'
        : 'bg-gray-100 text-[#001954]'"
      @click="selectCategory(category)"
    >
      {{ category.nombre }}
    </button>
  </section>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
