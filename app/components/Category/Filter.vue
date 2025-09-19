<script setup lang="ts">
import type { Category } from '~/interfaces/product.interface';

interface Emits {
  (e: 'action:selectCategory', value: Category): void
}

interface Props {
  categoryList: Category[]
  selectedCategory?: Category
}

const props = defineProps<Props>()

const sortedCategories = computed(() => {
  return [...props.categoryList].sort((a, b) => a.nombre.localeCompare(b.nombre));
});

const emit = defineEmits<Emits>()



</script>

<template>
  <section class="flex space-x-4 overflow-x-auto py-4 px-2">
    <button v-for="(category, index) in sortedCategories" :key="index"
      class="rounded-lg p-2 text-center text-sm text-[#001954] font-bold cursor-pointer hover:bg-gray-200 whitespace-nowrap min-w-max shadow-[0_5px_15px_0_rgba(0,0,0,0.15)] transition-colors duration-200"
      :class="[selectedCategory?.id === category.id ? 'bg-[#CCD1DD]' : 'bg-white']"
      @click="emit('action:selectCategory', category)">
      {{ category.nombre }}
    </button>
  </section>
</template>