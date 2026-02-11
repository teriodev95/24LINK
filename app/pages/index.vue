<script setup lang="ts">
const productsStore = useProductsStore()
const { isAuthenticated } = useAuth()
const { userOrders: orders, isLoading: isLoadingOrders, loadUserOrders } = useOrderApi()

// Scroll Detection
const isScrolled = ref(false)

const handleScroll = () => {
  if (import.meta.client) {
    isScrolled.value = window.scrollY > 10
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', handleScroll)
  }
})

if (!productsStore.hasData && !productsStore.isLoading) {
  productsStore.fetchData()
}
if (isAuthenticated.value) {
  loadUserOrders()
}

const hasActiveOrders = computed(() =>
  orders.value.some(o => o.estado !== 'completado')
)

useSeoMeta({
  title: "24 Horas de Fiesta - Servicio 24/7 de Bebidas y Botanas a Domicilio",
  description: "¡La fiesta no para! Servicio de entrega 24 horas de bebidas alcohólicas, cerveza, tequila, vodka, brandy, botanas y todo lo esencial para tu fiesta. Entrega rápida y segura en Morelia.",
  keywords: "bebidas domicilio 24 horas, cerveza domicilio, tequila entrega, vodka delivery, brandy a domicilio, botanas fiesta, bebidas alcohólicas 24/7, servicio nocturno Morelia, delivery alcohol",
  author: "24 Horas de Fiesta",
  ogTitle: "24 Horas de Fiesta - Todo para tu Fiesta las 24 Horas",
  ogDescription: "Cerveza, tequila, vodka, brandy, botanas y más. Servicio de entrega 24/7 para que tu fiesta nunca pare. ¡Pide ahora!",
  ogUrl: "https://24link.pages.dev/",
  ogImage: "./images/icono-24link.png",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <main class="min-h-screen bg-[#F5F7FA] pb-32">
    <!-- Decorative Background -->
    <div class="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
         style="background-image: radial-gradient(#001954 1px, transparent 1px); background-size: 24px 24px;">
    </div>

    <!-- Active Orders Bar (Fixed Top) -->
    <ClientOnly>
      <OrderList :orders="orders" />
    </ClientOnly>

    <!-- Header Section -->
    <header 
      class="sticky z-30 transition-all duration-300 ease-out"
      :class="[
        isAuthenticated && hasActiveOrders ? 'top-14' : 'top-0',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-b border-gray-100' 
          : 'bg-[#F5F7FA] border-b border-transparent shadow-none'
      ]"
    >
      <!-- Collapsible Title Section -->
      <div 
        class="transition-all duration-300 ease-out px-5 overflow-hidden"
        :class="isScrolled ? 'h-0 opacity-0 -translate-y-4 pt-0' : 'h-[88px] opacity-100 translate-y-0 pt-safe-top'"
      >
        <div class="flex justify-between items-end h-full py-2 animate-fade-in-down">
           <div>
              <h1 class="text-[26px] font-black text-[#001954] -tracking-[0.03em] leading-none mb-1">
                Tienda
              </h1>
              <p class="text-[13px] font-medium text-gray-400 leading-tight">
                Tus bebidas favoritas, frías y en minutos.
              </p>
           </div>
           
           <div class="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#001954]">
              <Icon name="lucide:store" size="20" />
           </div>
        </div>
      </div>
      
      <!-- Category Filter (Sticky) -->
      <div 
        class="transition-all duration-300 ease-out"
        :class="isScrolled 
          ? (isAuthenticated && hasActiveOrders ? 'py-3' : 'pt-safe-top pb-3')
          : 'pb-3'"
      >
         <!-- Categories Only -->
         <CategoryFilter 
           :category-list="productsStore.categories" 
           :selected-category="productsStore.selectedCategory" 
         />
      </div>
    </header>

    <div 
      class="relative z-10 px-0 space-y-4 pt-4"
      :class="{ 'pt-14': isAuthenticated && hasActiveOrders }"
    >

      <!-- Loading skeleton -->
      <div v-if="!productsStore.hasData && !productsStore.error" class="px-5">
        <UIStoreSkeleton />
      </div>

      <!-- Error state -->
      <div v-else-if="productsStore.error" class="flex flex-col justify-center items-center py-12 px-5 text-center">
        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
           <Icon name="lucide:wifi-off" class="text-red-400" size="24" />
        </div>
        <p class="text-[#001954] font-bold mb-1">Algo salió mal</p>
        <p class="text-sm text-gray-400 mb-4">{{ productsStore.error }}</p>
        <button @click="productsStore.fetchData()" class="text-xs font-bold text-[#001954] underline decoration-dotted underline-offset-4">Intentar de nuevo</button>
      </div>

      <!-- Main content -->
      <div v-else-if="productsStore.hasData">
        
        <!-- Product Grid -->
        <div class="animate-fade-in-up">
          <ProductList v-if="productsStore.shouldShowAllProducts || productsStore.shouldShowFilteredProducts" />

          <!-- No selection state -->
          <div v-else class="flex flex-col justify-center items-center py-24 px-5 text-center opacity-60">
            <Icon name="lucide:mouse-pointer-click" size="48" class="text-gray-300 mb-4" />
            <span class="text-[14px] font-medium text-gray-400">Selecciona una categoría para ver los productos</span>
          </div>
        </div>
      </div>
      
    </div>

    <UIBottomNav />
  </main>
</template>

<style scoped>
.pt-safe-top {
  padding-top: max(env(safe-area-inset-top), 20px);
}

/* Animations */
.animate-fade-in-down {
  animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in-up {
  opacity: 0; 
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.1s; 
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
