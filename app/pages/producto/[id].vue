<script setup lang="ts">
import formatCurrency from '~/utils/formatCurrency'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

const productId = computed(() => route.params.id as string)

// Ensure data is loaded for direct navigation
onMounted(() => {
  if (!productsStore.hasData) productsStore.fetchData()
})

const product = computed(() => productsStore.getProductById(productId.value))
const productRef = computed(() => product.value!)
const { quantity, canAddMore, increment, decrement } = useProductCart(productRef)

const similarProducts = computed(() => productsStore.getSimilarProducts(productId.value))

const { isExpanded, expand, collapse } = useProductExpansion()

const hasDiscount = computed(() => !!product.value?.porcentaje_descuento)

const discountedPrice = computed(() => {
  if (!product.value || !hasDiscount.value) return null
  return product.value.precio * (1 - product.value.porcentaje_descuento / 100)
})

const displayPrice = computed(() => discountedPrice.value ?? product.value!.precio)

const isOutOfStock = computed(() => product.value!.stock === 0)

const bottomButtonLabel = computed(() => {
  if (isOutOfStock.value) return 'Agotado'
  if (quantity.value === 0) return 'Agregar al carrito'
  return `Actualizar el carrito  •  MXN ${formatCurrency(displayPrice.value * quantity.value)}`
})

const handleBottomAction = () => {
  if (isOutOfStock.value) return
  if (quantity.value === 0) {
    increment()
  }
  router.back()
}

// Scroll to top when navigating between similar products
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
  <!-- Loading state -->
  <div v-if="productsStore.isLoading && !product" class="min-h-screen bg-white animate-pulse">
    <div class="w-full aspect-square bg-gray-200" />
    <div class="px-5 mt-5 space-y-3">
      <div class="h-7 w-3/4 bg-gray-200 rounded-lg" />
      <div class="h-7 w-1/3 bg-gray-200 rounded-lg" />
      <div class="h-4 w-full bg-gray-100 rounded" />
      <div class="h-4 w-2/3 bg-gray-100 rounded" />
    </div>
    <button
      class="fixed top-4 left-4 z-20 size-10 bg-white rounded-full shadow-md flex items-center justify-center"
      @click="router.back()"
    >
      <Icon name="lucide:chevron-left" size="20" class="text-[#001954]" />
    </button>
  </div>

  <!-- Product not found -->
  <div v-else-if="!product" class="min-h-screen bg-white flex flex-col items-center justify-center px-5">
    <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
      <Icon name="lucide:package-search" size="24" class="text-gray-300" />
    </div>
    <p class="text-[14px] font-semibold text-[#001954]">Producto no encontrado</p>
    <button
      class="mt-4 inline-flex items-center gap-2 bg-[#001954] text-white px-5 h-10 rounded-2xl text-[13px] font-semibold active:scale-[0.97] transition-all duration-150 cursor-pointer"
      @click="router.back()"
    >
      Volver
    </button>
  </div>

  <!-- Product detail -->
  <div v-else class="min-h-screen bg-white pb-28">
    <!-- Floating back button -->
    <button
      class="fixed top-4 left-4 z-20 size-10 bg-white rounded-full shadow-md flex items-center justify-center"
      @click="router.back()"
    >
      <LucideChevronLeft class="size-5" />
    </button>

    <!-- Product image -->
    <figure class="w-full aspect-square bg-gray-100 flex items-center justify-center">
      <img
        :src="product.imagen_url || '/img/beer.jpg'"
        :alt="product.nombre"
        class="max-h-full max-w-full object-contain"
        @error="($event.target as HTMLImageElement).src = '/img/beer.jpg'"
      >
    </figure>

    <!-- Product info -->
    <div class="px-5 mt-5 space-y-3">
      <!-- Name -->
      <h1 class="text-2xl font-bold text-gray-900 leading-tight">{{ product.nombre }}</h1>

      <!-- Price -->
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-2xl font-bold text-gray-900">MXN {{ formatCurrency(displayPrice) }}</span>
        <template v-if="hasDiscount">
          <span class="text-base text-gray-400 line-through">MXN {{ formatCurrency(product.precio) }}</span>
          <span class="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
            - {{ product.porcentaje_descuento }}%
          </span>
        </template>
      </div>

      <!-- Description -->
      <p v-if="product.descripcion" class="text-sm text-gray-500 leading-relaxed">
        {{ product.descripcion }}
      </p>

      <!-- Stock warning -->
      <p v-if="product.stock > 0 && product.stock <= 5" class="text-sm text-amber-600">
        Quedan {{ product.stock }} unidades
      </p>

      <!-- Quantity control (only when already in cart) -->
      <ClientOnly>
        <ProductDetailQuantityControl
          v-if="quantity > 0 && !isOutOfStock"
          :quantity="quantity"
          :can-add-more="canAddMore"
          @increment="increment"
          @decrement="decrement"
        />
      </ClientOnly>
    </div>

    <!-- Similar products -->
    <div v-if="similarProducts.length" class="mt-8">
      <h2 class="text-xl font-bold text-gray-900 px-5 mb-4">Artículos similares</h2>
      <div class="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
        <div v-for="similar in similarProducts" :key="similar.id" class="shrink-0 w-[150px]">
          <ProductCard
            :product="similar"
            :is-expanded="isExpanded(similar.id)"
            @action:expand="expand"
            @action:collapse="collapse"
          />
        </div>
      </div>
    </div>

    <!-- Fixed bottom button -->
    <div class="fixed bottom-0 left-0 right-0 z-10 bg-white px-5 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
      <button
        class="w-full h-14 rounded-2xl font-semibold text-base transition-transform active:scale-[0.98]"
        :class="isOutOfStock
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-[#001954] text-white'"
        :disabled="isOutOfStock"
        @click="handleBottomAction"
      >
        {{ bottomButtonLabel }}
      </button>
    </div>
  </div>
</template>
