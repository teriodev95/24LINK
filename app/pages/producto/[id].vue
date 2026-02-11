<script setup lang="ts">
import formatCurrency from '~/utils/formatCurrency'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

const productId = computed(() => route.params.id as string)

// Ensure data is loaded for direct navigation
if (!productsStore.hasData && !productsStore.isLoading) {
  productsStore.fetchData()
}

const product = computed(() => productsStore.getProductById(productId.value))
const productRef = computed(() => product.value!)
const { quantity, canAddMore, increment, decrement } = useProductCart(productRef)

const similarProducts = computed(() => productsStore.getSimilarProducts(productId.value))

const { expandedProductId, isExpanded, expand, collapse } = useProductExpansion()

const hasDiscount = computed(() => !!product.value?.porcentaje_descuento)

const discountedPrice = computed(() => {
  if (!product.value || !hasDiscount.value) return null
  return product.value.precio * (1 - product.value.porcentaje_descuento / 100)
})

const displayPrice = computed(() => discountedPrice.value ?? product.value!.precio)

const isOutOfStock = computed(() => product.value!.stock === 0)

// Helper to handle add action
const handleAdd = () => {
  if (isOutOfStock.value) return
  if (quantity.value === 0) increment()
  router.back()
}

// Scroll to top when exploring similar
watch(productId, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

useSeoMeta({
  title: () => product.value?.nombre || 'Producto',
  description: () => product.value?.descripcion || '',
  ogTitle: () => product.value?.nombre || 'Producto',
  ogDescription: () => product.value?.descripcion || '',
  ogImage: () => product.value?.imagen_url || '/img/beer.jpg',
})
</script>

<template>
  <main class="min-h-screen bg-white pb-32 font-sans selection:bg-[#001954] selection:text-white">
    
    <!-- Loading State -->
    <div v-if="productsStore.isLoading && !product" class="animate-pulse">
       <div class="h-[40vh] bg-gray-50 w-full" />
       <div class="px-5 py-8 space-y-6">
          <div class="h-8 bg-gray-100 rounded-lg w-3/4" />
          <div class="h-6 bg-gray-100 rounded-lg w-1/4" />
          <div class="space-y-3 pt-6">
             <div class="h-4 bg-gray-50 rounded w-full" />
             <div class="h-4 bg-gray-50 rounded w-5/6" />
             <div class="h-4 bg-gray-50 rounded w-4/6" />
          </div>
       </div>
    </div>

    <!-- Product Not Found -->
    <div v-else-if="!product" class="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
       <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
          <Icon name="lucide:package-open" size="32" class="text-gray-300" />
       </div>
       <h1 class="text-lg font-bold text-[#001954] mb-2">Producto no disponible</h1>
       <p class="text-gray-400 text-sm mb-8 leading-relaxed max-w-[240px] mx-auto">Lo sentimos, este producto no está disponible en este momento.</p>
       <button @click="router.back()" class="px-8 py-3 bg-[#001954] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#001954]/10 active:scale-95 transition-transform">
          Regresar a la tienda
       </button>
    </div>

    <!-- Content -->
    <div v-else class="relative animate-fade-in group/page">
       
       <!-- Header Actions -->
       <header class="fixed top-0 left-0 right-0 z-30 flex justify-between items-center px-4 py-4 pt-safe-top pointer-events-none">
          <button 
            @click="router.back()" 
            class="pointer-events-auto w-10 h-10 bg-white/80 backdrop-blur-md shadow-sm border border-gray-100/50 rounded-full flex items-center justify-center text-[#001954] active:scale-90 transition-all hover:bg-white hover:shadow-md"
          >
             <Icon name="lucide:arrow-left" size="20" stroke-width="2.5" />
          </button>
       </header>

       <!-- Hero Section (Updated to White & Flat) -->
       <div class="relative bg-white h-[45vh] flex items-center justify-center overflow-hidden pt-safe-top">
          <img
            :src="product.imagen_url || '/img/beer.jpg'"
            :alt="product.nombre"
            class="relative z-10 h-[85%] w-auto object-contain transition-transform duration-700 hover:scale-[1.02]"
            @error="($event.target as HTMLImageElement).src = '/img/beer.jpg'"
          />
       </div>

       <!-- Product Details Sheet (Clean white flow) -->
       <div class="relative bg-white px-6 pb-32">
          
          <div class="space-y-8 animate-slide-up">
             
             <!-- Header -->
             <div class="space-y-4">
                <div class="flex items-center justify-between">
                   <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest border border-gray-100 px-3 py-1 rounded-full bg-gray-50">
                      {{ product.categoria?.nombre || 'General' }}
                   </span>
                   
                   <span v-if="hasDiscount" class="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-sm shadow-red-500/20">
                      -{{ product.porcentaje_descuento }}%
                   </span>
                   <span v-else-if="!isOutOfStock" class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      DISPONIBLE
                   </span>
                </div>

                <h1 class="text-[26px] font-black text-[#001954] leading-[1.15] tracking-tight">
                  {{ product.nombre }}
                </h1>
                
                <div class="flex items-baseline gap-3">
                   <span class="text-3xl font-black text-[#001954] tracking-tight">
                      {{ formatCurrency(displayPrice) }}
                   </span>
                   <span v-if="hasDiscount" class="text-lg text-gray-400 line-through decoration-gray-300 decoration-2">
                      {{ formatCurrency(product.precio) }}
                   </span>
                </div>
             </div>

             <!-- Description -->
             <div v-if="product.descripcion" class="prose prose-sm">
                <p class="text-[15px] leading-relaxed text-gray-500 font-medium text-justify">
                   {{ product.descripcion }}
                </p>
             </div>
             
             <!-- Stock Warning -->
             <div v-if="product.stock <= 5 && !isOutOfStock" class="flex items-center gap-2 bg-amber-50 p-3 rounded-xl border border-amber-100/50">
                <Icon name="lucide:alert-circle" size="16" class="text-amber-500 shrink-0" />
                <p class="text-xs font-bold text-amber-700">¡Pocas unidades! Solo quedan {{ product.stock }}</p>
             </div>
             
             <!-- Divider -->
             <div class="h-px bg-gray-50 w-full my-6"></div>

             <!-- Similar Products -->
             <div v-if="similarProducts.length > 0">
                <h3 class="text-[13px] font-bold text-gray-400 mb-4 uppercase tracking-wider">
                   También te puede gustar
                </h3>
                <section class="grid grid-cols-3 gap-3">
                   <ProductCard
                     v-for="similar in similarProducts.slice(0, 10)"
                     :key="similar.id"
                     :product="similar"
                     :is-expanded="expandedProductId === similar.id"
                     @action:expand="expand"
                     @action:collapse="collapse"
                   />
                </section>
             </div>
          </div>
       </div>

       <!-- Sticky Footer Action Bar -->
       <div class="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 px-5 pb-6 pt-3 safe-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.03)] backdrop-blur-lg bg-white/95 footer-safe-area">
          <div class="flex items-center gap-4 h-[56px]">
             
             <!-- Quantity Stepper -->
             <div class="grid grid-cols-3 items-center bg-gray-100 rounded-xl h-full w-[140px] px-1 shadow-inner relative" :class="{ 'opacity-50 pointer-events-none': isOutOfStock }">
                <button 
                  @click="decrement"
                  class="w-full h-full flex items-center justify-center text-[#001954] hover:bg-white/50 rounded-lg transition-colors active:scale-90"
                  :disabled="quantity <= 0"
                >
                   <Icon name="lucide:minus" size="20" stroke-width="2.5" />
                </button>
                
                <span class="text-center font-black text-[#001954] text-xl tabular-nums leading-none">
                  {{ Math.max(1, quantity || 1) }}
                </span>
                
                <button 
                  @click="increment"
                  class="w-full h-full flex items-center justify-center text-[#001954] hover:bg-white/50 rounded-lg transition-colors active:scale-90"
                  :disabled="!canAddMore"
                >
                   <Icon name="lucide:plus" size="20" stroke-width="2.5" />
                </button>
             </div>

             <!-- Add Button -->
             <button 
                class="flex-1 h-full bg-[#001954] text-white rounded-xl font-bold text-[15px] shadow-lg shadow-[#001954]/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-[#001954]/90"
                :class="{ 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed': isOutOfStock }"
                :disabled="isOutOfStock"
                @click="handleAdd"
             >
                <template v-if="isOutOfStock">
                  <span>Agotado</span>
                </template>
                <template v-else>
                  <span>Agregar</span>
                  <span class="opacity-40">•</span>
                  <span>{{ formatCurrency(displayPrice * Math.max(1, quantity || 1)) }}</span>
                </template>
             </button>
          </div>
       </div>

    </div>
  </main>
</template>

<style scoped>
.pt-safe-top {
  padding-top: max(env(safe-area-inset-top), 20px);
}
.safe-bottom {
  padding-bottom: max(env(safe-area-inset-bottom), 0px);
}
.footer-safe-area {
  padding-bottom: max(env(safe-area-inset-bottom), 24px); 
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-slide-up {
  opacity: 0;
  animation: slideUp 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  animation-delay: 0.1s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
