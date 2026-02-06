<script setup lang="ts">
import formatCurrency from '~/utils/formatCurrency'

const productsStore = useProductsStore()
const cartStore = useCartStore()
const { isAuthenticated } = useAuth()
const router = useRouter()
const query = ref('')
const inputRef = ref<HTMLInputElement>()

if (!productsStore.hasData) {
  await productsStore.fetchData()
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

onMounted(() => {
  nextTick(() => inputRef.value?.focus())
})
</script>

<template>
  <main class="min-h-screen bg-white flex flex-col">
    <!-- Sticky search header -->
    <div class="sticky top-0 z-10 bg-white px-4 pt-4 pb-3">
      <div class="flex items-center gap-3">
        <button
          class="shrink-0 w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors cursor-pointer"
          @click="router.back()"
        >
          <Icon name="lucide:arrow-left" size="20" class="text-[#001954]" />
        </button>

        <div class="flex-1 relative">
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="Buscar productos..."
            class="w-full bg-gray-100 rounded-2xl py-3 pl-11 pr-10 text-[15px] text-[#001954] placeholder:text-gray-400 outline-none focus:bg-gray-50 focus:ring-2 focus:ring-[#001954]/10 transition-all duration-200"
          >
          <Icon name="lucide:search" size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <button
            v-if="hasQuery"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 active:bg-gray-300 transition-colors cursor-pointer"
            @click="query = ''"
          >
            <Icon name="lucide:x" size="12" class="text-gray-500" />
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto" :class="hasItems ? 'pb-24' : 'pb-12'">

      <!-- State: no query — show category suggestions -->
      <div v-if="!hasQuery" class="px-5 pt-4">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Explorar categorías</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in topCategories"
            :key="cat.id"
            class="bg-gray-50 rounded-full px-4 py-2 text-[13px] font-medium text-[#001954] active:bg-gray-100 active:scale-[0.97] transition-all duration-150 cursor-pointer"
            @click="handleCategoryTap(cat.id, cat.nombre)"
          >
            {{ cat.nombre }}
          </button>
        </div>

        <div class="flex flex-col items-center pt-16">
          <div class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <Icon name="lucide:search" size="24" class="text-gray-300" />
          </div>
          <p class="text-gray-400 text-[15px] text-center">Busca por nombre de producto</p>
        </div>
      </div>

      <!-- State: query but no results -->
      <div v-else-if="results.length === 0" class="flex flex-col items-center pt-20 px-6">
        <div class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <Icon name="lucide:search-x" size="24" class="text-gray-300" />
        </div>
        <p class="text-gray-500 text-center text-[15px]">Sin resultados para</p>
        <p class="text-[#001954] font-semibold text-center mt-1">"{{ query }}"</p>
        <p class="text-gray-400 text-xs text-center mt-3">Intenta con otro nombre o revisa los pasillos</p>
      </div>

      <!-- State: results -->
      <div v-else>
        <!-- Result count -->
        <div class="px-5 py-2">
          <p class="text-xs text-gray-400">
            {{ results.length }} resultado{{ results.length !== 1 ? 's' : '' }}
          </p>
        </div>

        <!-- Grouped results -->
        <div v-for="group in groupedResults" :key="group.name" class="mb-4">
          <p class="px-5 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            {{ group.name }}
          </p>

          <NuxtLink
            v-for="product in group.products"
            :key="product.id"
            :to="`/producto/${product.id}`"
            class="group flex items-center gap-3.5 px-5 py-2.5 active:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 group-active:scale-95 transition-transform duration-150">
              <img
                :src="product.imagen_url || '/img/beer.jpg'"
                :alt="product.nombre"
                class="w-full h-full object-cover"
                loading="lazy"
              >
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[14px] font-medium text-[#001954] truncate leading-tight">{{ product.nombre }}</p>
              <p class="text-[13px] text-gray-400 mt-0.5">MXN {{ formatCurrency(product.precio) }}</p>
            </div>
            <Icon name="lucide:chevron-right" size="14" class="text-gray-300 shrink-0 group-active:translate-x-0.5 transition-transform duration-150" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Floating cart pill -->
    <ClientOnly>
      <div v-if="hasItems" class="fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)]">
        <div class="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
        <div class="relative flex justify-center px-5 pb-5">
          <NuxtLink
            :to="checkoutUrl"
            class="bg-[#001954] text-white rounded-full px-5 h-11 inline-flex items-center gap-2.5 shadow-[0_4px_20px_rgba(0,25,84,0.3)] active:scale-[0.97] transition-transform duration-150"
          >
            <span class="text-[13px] font-semibold">{{ cartLabel }}</span>
            <span class="text-white/25">|</span>
            <Icon name="lucide:shopping-cart" size="15" />
            <span class="text-white/25">|</span>
            <span class="text-[13px] font-semibold">MXN {{ formatCurrency(cartStore.cart.subtotal) }}</span>
          </NuxtLink>
        </div>
      </div>
    </ClientOnly>
  </main>
</template>
