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
  <section class="flex gap-2.5 overflow-x-auto py-3 px-5 scrollbar-hide scroll-smooth snap-x snap-mandatory">
    <!-- 'All' Filter -->
    <button
      @click="selectCategory({ id: 'all', nombre: 'Todas' })"
      class="snap-start rounded-full px-5 h-[34px] text-[13px] font-bold cursor-pointer whitespace-nowrap transition-all duration-200 active:scale-[0.92] shrink-0 border"
      :class="selectedCategory?.id === 'all'
        ? 'bg-[#001954] text-white border-[#001954] shadow-md shadow-[#001954]/25 scale-[1.02]'
        : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-[#001954]'"
    >
      Todas
    </button>
    
    <!-- Dynamic Categories -->
    <button
      v-for="(category, index) in sortedCategories"
      :key="index"
      @click="selectCategory(category)"
      class="snap-start rounded-full px-5 h-[34px] text-[13px] font-bold cursor-pointer whitespace-nowrap transition-all duration-200 active:scale-[0.92] shrink-0 border"
      :class="selectedCategory?.id === category.id
        ? 'bg-[#001954] text-white border-[#001954] shadow-md shadow-[#001954]/25 scale-[1.02]'
        : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-[#001954]'"
    >
      {{ category.nombre }}
    </button>
    
    <!-- Padding spacer for ease of scrolling to the end -->
    <div class="w-1 shrink-0"></div>
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
