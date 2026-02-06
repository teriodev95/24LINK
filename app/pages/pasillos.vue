<script setup lang="ts">
import type { Category } from '~/interfaces/product.interface'

const productsStore = useProductsStore()

if (!productsStore.hasData) {
  await productsStore.fetchData()
}

const getCategoryThumbs = (categoryId: string) => {
  return productsStore.products
    .filter(p => p.categoria_id === categoryId && p.imagen_url)
    .slice(0, 3)
    .map(p => p.imagen_url)
}

const getProductCount = (categoryId: string) => {
  return productsStore.products.filter(p => p.categoria_id === categoryId).length
}

const handleSelect = (category: Category | { id: string; nombre: string }) => {
  productsStore.setSelectedCategory(category)
  navigateTo('/')
}
</script>

<template>
  <main class="min-h-screen bg-white pb-36">
    <div class="px-5 pt-6 pb-4">
      <h1 class="text-[26px] font-bold text-[#001954] tracking-tight">Pasillos</h1>
    </div>

    <div v-if="productsStore.isLoading" class="flex justify-center py-16">
      <UILoading :size="64" />
    </div>

    <div v-else class="px-4 space-y-2">
      <!-- "Ver todo" -->
      <button
        class="group w-full flex items-center justify-between bg-[#001954] rounded-[18px] px-4 py-3.5 active:scale-[0.98] transition-all duration-200 cursor-pointer"
        @click="handleSelect({ id: 'all', nombre: 'Todas' })"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <Icon name="lucide:sparkles" size="16" class="text-white" />
          </div>
          <div class="text-left">
            <p class="text-white font-semibold text-[15px] leading-tight">Ver todo</p>
            <p class="text-white/40 text-[11px]">{{ productsStore.products.length }} productos</p>
          </div>
        </div>
        <Icon name="lucide:chevron-right" size="16" class="text-white/30 group-active:translate-x-0.5 transition-transform duration-200" />
      </button>

      <!-- Category cards -->
      <button
        v-for="category in productsStore.sortedCategories"
        :key="category.id"
        class="group w-full flex items-center gap-4 bg-gray-50/80 rounded-[18px] px-4 py-3 active:scale-[0.98] active:bg-gray-100 transition-all duration-200 cursor-pointer"
        @click="handleSelect(category)"
      >
        <!-- Overlapping circles -->
        <div
          class="relative shrink-0 h-10"
          :style="{ width: `${40 + (getCategoryThumbs(category.id).length - 1) * 24}px` }"
        >
          <div
            v-for="(src, i) in getCategoryThumbs(category.id)"
            :key="i"
            class="absolute top-0 w-10 h-10 rounded-full overflow-hidden ring-[2.5px] ring-white shadow-sm group-active:shadow-none transition-shadow duration-200"
            :style="{ left: `${i * 24}px`, zIndex: 3 - i }"
          >
            <img :src="src" alt="" class="w-full h-full object-cover" loading="lazy">
          </div>
        </div>

        <!-- Name + count -->
        <div class="flex-1 text-left min-w-0">
          <p class="text-[#001954] font-semibold text-[15px] leading-tight truncate">{{ category.nombre }}</p>
          <p class="text-gray-400 text-[11px] mt-0.5">{{ getProductCount(category.id) }} productos</p>
        </div>

        <!-- Arrow -->
        <Icon name="lucide:chevron-right" size="16" class="text-gray-300 shrink-0 group-active:translate-x-0.5 transition-transform duration-200" />
      </button>
    </div>

    <UIBottomNav />
  </main>
</template>
