<script setup lang="ts">
import type { Category } from '~/interfaces/product.interface'

const productsStore = useProductsStore()

if (!productsStore.hasData && !productsStore.isLoading) {
  productsStore.fetchData()
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

definePageMeta({
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  }
})
</script>

<template>
  <main class="min-h-screen bg-[#F5F7FA] pb-36 overflow-x-hidden">
    <div class="px-5 pt-8 pb-6 animate-fade-in-down">
      <h1 class="text-[28px] font-black text-[#001954] tracking-tight leading-none mb-1">Pasillos</h1>
      <p class="text-gray-400 font-medium text-[14px]">Explora todas nuestras categorías</p>
    </div>

    <div v-if="productsStore.isLoading && !productsStore.hasData" class="px-5 space-y-3 animate-pulse">
      <div class="h-20 rounded-[20px] bg-gray-200" />
      <div v-for="i in 6" :key="i" class="h-24 bg-gray-100 rounded-[20px]" />
    </div>

    <div v-else class="px-5 space-y-3 pb-safe-bottom">
      <!-- "Ver todo" Button -->
      <button
        class="group w-full relative overflow-hidden bg-[#001954] rounded-[24px] p-5 text-left shadow-lg shadow-[#001954]/20 active:scale-[0.98] transition-all duration-300 hover:scale-[1.01] cursor-pointer mb-6 animate-slide-up"
        style="animation-delay: 0ms;"
        @click="handleSelect({ id: 'all', nombre: 'Todas' })"
      >
        <!-- Decorative bg circle -->
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
        
        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/5 shadow-inner">
               <Icon name="lucide:layers" size="24" class="text-emerald-400" />
             </div>
             <div>
               <h3 class="text-white font-bold text-[17px] leading-tight mb-1">Todas las categorías</h3>
               <p class="text-emerald-400/80 text-[12px] font-medium">{{ productsStore.products.length }} productos disponibles</p>
             </div>
          </div>
          <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
             <Icon name="lucide:arrow-right" size="20" class="text-white group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </button>

      <!-- Category Grid -->
      <div class="grid gap-3">
        <button
          v-for="(category, index) in productsStore.sortedCategories"
          :key="category.id"
          class="group w-full flex items-center gap-3 bg-white rounded-[20px] p-4 text-left shadow-sm border border-gray-100/50 hover:border-gray-200 active:scale-[0.98] transition-all duration-200 cursor-pointer animate-slide-up hover:shadow-md overflow-hidden"
          :style="{ animationDelay: `${(index + 1) * 50}ms` }"
          @click="handleSelect(category)"
        >
          <!-- Product Preview Circles -->
          <div class="relative shrink-0 w-[60px] h-10 flex items-center">
            <template v-if="getCategoryThumbs(category.id).length > 0">
               <div
                  v-for="(src, i) in getCategoryThumbs(category.id).slice(0, 2)"
                  :key="i"
                  class="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-50"
                  :style="{ left: `${i * 20}px`, zIndex: 2 - i }"
               >
                  <img :src="src" class="w-full h-full object-contain p-0.5" />
               </div>
            </template>
            <div v-else class="w-10 h-10 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center">
               <Icon name="lucide:package" size="18" class="text-gray-300" />
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h3 class="text-[#001954] font-bold text-[14px] leading-snug mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2 break-words">
               {{ category.nombre }}
            </h3>
            <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-50 text-[11px] font-bold text-gray-400 border border-gray-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-colors">
               {{ getProductCount(category.id) }} productos
            </span>
          </div>

          <!-- Arrow -->
          <Icon name="lucide:chevron-right" size="18" class="shrink-0 text-gray-300 group-hover:text-emerald-500 transition-colors" />
        </button>
      </div>
    </div>

    <UIBottomNav />
  </main>
</template>

<style scoped>
.pb-safe-bottom {
  padding-bottom: max(env(safe-area-inset-bottom), 20px);
}

.animate-fade-in-down {
  animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-slide-up {
  opacity: 0;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
