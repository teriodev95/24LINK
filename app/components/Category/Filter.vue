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
  <section class="flex gap-x-[10px] overflow-x-auto py-2 px-6 w-full scroll">
    <button
      class="rounded-lg p-2 text-center text-sm text-[#001954] font-bold cursor-pointer hover:bg-gray-200 whitespace-nowrap flex-1 drop-shadow-lg transition-colors duration-200"
      :class="[selectedCategory?.id === 'all' ? 'bg-[#CCD1DD]' : 'bg-white']"
      @click="selectCategory({ id: 'all', nombre: 'Todas' })">
      Todas las categorías
    </button>
    <button v-for="(category, index) in sortedCategories" :key="index"
      class="rounded-lg p-2 text-center text-sm text-[#001954] font-bold cursor-pointer hover:bg-gray-200 whitespace-nowrap flex-1 drop-shadow-lg transition-colors duration-200"
      :class="[selectedCategory?.id === category.id ? 'bg-[#CCD1DD]' : 'bg-white']" @click="selectCategory(category)">
      {{ category.nombre }}
    </button>
  </section>
</template>