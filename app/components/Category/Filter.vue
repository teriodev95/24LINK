<script setup lang="ts">
interface Emits {
  (e: 'action:selectCategory', value: string): void
}

interface Props {
  categoryList: string[]
  selectedCategory: string
}

defineProps<Props>()
const emit = defineEmits<Emits>()



</script>

<template>
  <section class="flex space-x-4 overflow-x-auto py-4 px-2">
    <button v-for="(category, index) in categoryList" :key="index"
      class="rounded-lg p-2 text-center text-sm text-[#001954] font-bold cursor-pointer hover:bg-gray-200 whitespace-nowrap min-w-max shadow-[0_5px_15px_0_rgba(0,0,0,0.15)] transition-colors duration-200"
      :class="[selectedCategory === category ? 'bg-[#CCD1DD]' : 'bg-white']"
      @click="emit('action:selectCategory', category)">
      {{ category }}
    </button>
  </section>
</template>