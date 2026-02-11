<script setup lang="ts">
import formatCurrency from '~/utils/formatCurrency'

const productsStore = useProductsStore()
const cartStore = useCartStore()
const { isAuthenticated } = useAuth()
const router = useRouter()
const query = ref('')
const inputRef = ref<HTMLInputElement>()
const { history, add: addToHistory, remove: removeFromHistory, clear: clearHistory } = useSearchHistory()

if (!productsStore.hasData && !productsStore.isLoading) {
  productsStore.fetchData()
}

const hasItems = computed(() => cartStore.totalItems > 0)

const cartLabel = computed(() => {
  const count = cartStore.totalItems
  return count === 1 ? '1 Producto' : `${count} Productos`
})

const checkoutUrl = computed(() =>
  isAuthenticated.value ? '/detalles-orden' : '/verificacion'
)

// Search results
const results = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) return []
  return productsStore.products
    .filter(p => p.nombre.toLowerCase().includes(q))
    .slice(0, 24)
})

const hasQuery = computed(() => query.value.trim().length > 0)

// Group results by category
const groupedResults = computed(() => {
  if (!hasQuery.value || results.value.length === 0) return []

  const groups = new Map<string, { name: string; products: typeof results.value }>()
  for (const product of results.value) {
    if (!groups.has(product.categoria_id)) {
      groups.set(product.categoria_id, {
        name: productsStore.getCategoryName(product.categoria_id),
        products: []
      })
    }
    groups.get(product.categoria_id)!.products.push(product)
  }
  return Array.from(groups.values())
})

// Quick category suggestions when no query
const topCategories = computed(() => {
  return productsStore.sortedCategories.slice(0, 6)
})

const handleCategoryTap = (categoryId: string, categoryName: string) => {
  productsStore.setSelectedCategory({ id: categoryId, nombre: categoryName })
  navigateTo('/')
}

const handleResultClick = (productName: string) => {
  addToHistory(query.value.trim())
}

const applyHistoryTerm = (term: string) => {
  query.value = term
  inputRef.value?.focus()
  addToHistory(term) 
}

const handleEnter = () => {
  const term = query.value.trim()
  if (term) {
    addToHistory(term)
    inputRef.value?.blur()
  }
}

const handleClearHistory = () => {
  if (confirm('¿Borrar todo el historial?')) {
    clearHistory()
  }
}

onMounted(() => {
  nextTick(() => inputRef.value?.focus())
})
</script>

<template>
  <main class="min-h-screen bg-white flex flex-col">
    <!-- Sticky search header -->
    <div class="sticky top-0 z-10 bg-white px-4 pt-safe-top pb-3 border-b border-gray-100/50">
      <div class="flex items-center gap-3">
        <button
          class="shrink-0 w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors cursor-pointer text-[#001954]"
          @click="router.back()"
        >
          <Icon name="lucide:arrow-left" size="24" />
        </button>

        <div class="flex-1 relative">
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="Buscar productos..."
            class="w-full bg-gray-100 rounded-2xl py-3 pl-11 pr-10 text-[16px] text-[#001954] placeholder:text-gray-400 outline-none focus:bg-white focus:ring-2 focus:ring-[#001954]/10 focus:shadow-sm transition-all duration-200"
            @keydown.enter="handleEnter"
          >
          <Icon name="lucide:search" size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <button
            v-if="hasQuery"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 active:bg-gray-300 transition-colors cursor-pointer"
            @click="query = ''; inputRef?.focus()"
          >
            <Icon name="lucide:x" size="14" class="text-gray-500" />
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto" :class="hasItems ? 'pb-28' : 'pb-12'">

      <!-- State: no query — show history + category suggestions -->
      <div v-if="!hasQuery" class="px-5 pt-6 space-y-8">

        <!-- Search history -->
        <div v-if="history.length > 0" class="animate-fade-in">
          <div class="flex items-center justify-between mb-3 px-1">
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Recientes</p>
            <button 
              @click="handleClearHistory" 
              class="text-[11px] font-bold text-red-400 hover:text-red-500 transition-colors"
            >
              Borrar todo
            </button>
          </div>
          
          <div class="space-y-1">
            <div
              v-for="term in history"
              :key="term"
              class="group flex items-center justify-between py-3 px-2 -mx-2 rounded-xl active:bg-gray-50 transition-colors cursor-pointer"
              @click="applyHistoryTerm(term)"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-gray-200 transition-colors">
                  <Icon name="lucide:clock" size="14" class="text-gray-400" />
                </div>
                <span class="text-[15px] font-medium text-[#001954] truncate">{{ term }}</span>
              </div>
              
              <button
                class="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                @click.stop="removeFromHistory(term)"
              >
                <Icon name="lucide:x" size="16" />
              </button>
            </div>
          </div>
        </div>

        <!-- Category suggestions -->
        <div>
          <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Explorar categorías</p>
          <div class="flex flex-wrap gap-2.5">
            <button
              v-for="cat in topCategories"
              :key="cat.id"
              class="bg-white border border-gray-100 rounded-full px-5 py-2.5 text-[13px] font-bold text-[#001954] shadow-sm active:scale-[0.97] hover:border-[#001954]/20 transition-all duration-200 cursor-pointer"
              @click="handleCategoryTap(cat.id, cat.nombre)"
            >
              {{ cat.nombre }}
            </button>
          </div>
        </div>
      </div>

      <!-- State: query but no results -->
      <div v-else-if="results.length === 0" class="flex flex-col items-center pt-24 px-6 animate-fade-in">
        <div class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6 border border-gray-100">
          <Icon name="lucide:search-x" size="32" class="text-gray-300" />
        </div>
        <p class="text-gray-400 text-[14px] text-center mb-1">No encontramos resultados para</p>
        <p class="text-[#001954] font-bold text-[18px] text-center mb-4 break-all">"{{ query }}"</p>
        <div class="h-px w-12 bg-gray-200 mb-6"></div>
        <p class="text-gray-400 text-xs text-center max-w-[200px] leading-relaxed">
          Intenta con palabras más generales o revisa nuestras categorías
        </p>
        <button 
          @click="query = ''; inputRef?.focus()"
          class="mt-6 text-[#001954] font-bold text-sm underline decoration-dotted underline-offset-4"
        >
          Borrar búsqueda
        </button>
      </div>

      <!-- State: results -->
      <div v-else class="animate-fade-in-up">
        <!-- Result count -->
        <div class="px-5 py-3 border-b border-gray-50 flex justify-between items-center">
          <p class="text-[12px] font-medium text-gray-400">
            {{ results.length }} resultados encontrados
          </p>
        </div>

        <!-- Grouped results -->
        <div v-for="group in groupedResults" :key="group.name" class="mt-4">
          <div class="sticky top-[72px] bg-white/95 backdrop-blur-sm z-10 px-5 py-2 border-b border-gray-50 mb-2">
            <p class="text-[11px] font-black text-[#001954] uppercase tracking-widest">
              {{ group.name }}
            </p>
          </div>

          <NuxtLink
            v-for="product in group.products"
            :key="product.id"
            :to="`/producto/${product.id}`"
            class="group flex items-start gap-4 px-5 py-3 active:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            @click="handleResultClick(product.nombre)"
          >
            <div class="w-16 h-16 rounded-[14px] bg-gray-50 overflow-hidden shrink-0 border border-gray-100 group-active:scale-95 transition-transform duration-200 relative">
               <!-- Gradient overlay -->
               <div class="absolute inset-0 bg-gradient-to-tr from-gray-100/50 to-transparent pointer-events-none"></div>
              <img
                :src="product.imagen_url || '/img/beer.jpg'"
                :alt="product.nombre"
                class="w-full h-full object-contain p-2 mix-blend-multiply"
                loading="lazy"
              >
            </div>
            <div class="flex-1 min-w-0 py-1">
              <p class="text-[15px] font-bold text-[#001954] leading-snug line-clamp-2 mb-1 group-hover:text-blue-700 transition-colors">{{ product.nombre }}</p>
              <div class="flex items-center gap-2">
                 <p class="text-[13px] font-medium text-gray-500">MXN {{ formatCurrency(product.precio) }}</p>
                 <span v-if="product.descripcion" class="text-[10px] text-gray-300">•</span>
                 <p v-if="product.descripcion" class="text-[11px] text-gray-400 truncate max-w-[120px]">{{ product.descripcion }}</p>
              </div>
            </div>
            <div class="self-center w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#001954] group-hover:text-white transition-all">
               <Icon name="lucide:chevron-right" size="16" class="text-gray-300 group-hover:text-white transition-colors" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Floating cart pill (Matches Home Style) -->
    <ClientOnly>
      <div v-if="hasItems" class="fixed bottom-0 left-0 right-0 z-40 pb-safe-bottom">
        <div class="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none h-24 -top-24 translate-y-full" />
        <div class="relative flex justify-center px-5 pb-5 pt-2">
          <NuxtLink
            :to="checkoutUrl"
            class="bg-[#001954] text-white rounded-full px-5 h-11 inline-flex items-center gap-3 shadow-[0_4px_20px_rgba(0,25,84,0.3)] active:scale-[0.97] transition-transform duration-150"
          >
            <span class="text-[13px] font-semibold">{{ cartLabel }}</span>
            <div class="h-3 w-px bg-white/20"></div>
            <Icon name="lucide:shopping-cart" size="16" />
            <div class="h-3 w-px bg-white/20"></div>
            <span class="text-[13px] font-semibold">MXN {{ formatCurrency(cartStore.cart.subtotal) }}</span>
          </NuxtLink>
        </div>
      </div>
    </ClientOnly>
  </main>
</template>

<style scoped>
.pt-safe-top {
  padding-top: max(env(safe-area-inset-top), 20px);
}
.pb-safe-bottom {
  padding-bottom: max(env(safe-area-inset-bottom), 20px);
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
