<script setup lang="ts">
import formatCurrency from '~/utils/formatCurrency'

const router = useRouter()
const orderStore = useOrderStore()
const cartStore = useCartStore()
const { $toast } = useNuxtApp()
const { createOrder, isLoading } = useOrderApi()
const { isStoreOpen } = useStoreStatusApi()
orderStore.initializeDefaults()

const contactCardRef = ref()
const isCartEmpty = computed(() => cartStore.totalItems === 0)

const isButtonDisabled = computed(() =>
  isCartEmpty.value || !isStoreOpen.value || !orderStore.canPlaceOrder || orderStore.calculatingDelivery || isLoading.value
)

const handleCreateOrder = async () => {
  if (!isStoreOpen.value) {
    $toast.error('En este momento no estamos recibiendo pedidos')
    return
  }

  if (!orderStore.canPlaceOrder) {
    $toast.error('Falta dirección o hay error de cálculo')
    if (contactCardRef.value?.scrollToCardWithAnimation) {
      contactCardRef.value.scrollToCardWithAnimation()
    }
    return
  }

  const result = await createOrder()

  if (result.success) {
    router.push(`/status-pedido?pedido=${result.numeroPedido}`)
  } else {
    if (result.error?.includes('dirección') || result.error?.includes('address')) {
      if (contactCardRef.value?.scrollToCardWithAnimation) {
        contactCardRef.value.scrollToCardWithAnimation()
      }
    }
  }
}

onMounted(() => {
  orderStore.clearSelectedAddress()
})

useSeoMeta({
  title: "Detalles del Pedido - 24 Horas de Fiesta",
  description: "Revisa y confirma tu pedido de bebidas y botanas.",
  robots: "noindex, follow",
})
</script>

<template>
  <main class="min-h-screen bg-white pb-28">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-5 py-4">
      <div class="flex items-center gap-3">
        <button
          class="w-10 h-10 rounded-full flex items-center justify-center active:bg-gray-100 transition-colors cursor-pointer"
          @click="router.back()"
        >
          <Icon name="lucide:arrow-left" size="20" class="text-[#001954]" />
        </button>
        <h1 class="text-[18px] font-bold text-[#001954]">Tu pedido</h1>
      </div>
    </div>

    <div class="px-5 space-y-6">
      <!-- Store closed banner -->
      <ClientOnly>
        <div
          v-if="!isStoreOpen"
          class="flex items-start gap-3 bg-[#001954]/5 rounded-2xl p-4"
        >
          <div class="w-10 h-10 rounded-full bg-[#001954]/10 flex items-center justify-center shrink-0">
            <Icon name="lucide:moon" size="20" class="text-[#001954]" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[14px] font-semibold text-[#001954] leading-tight">
              Estamos descansando por ahora
            </p>
            <p class="text-[12px] text-[#001954]/60 mt-1 leading-relaxed">
              No te preocupes, tu carrito está guardado. En cuanto abramos podrás completar tu pedido sin problemas.
            </p>
          </div>
        </div>
      </ClientOnly>

      <!-- Address alert -->
      <div
        v-if="!isCartEmpty && !orderStore.selectedAddress?.id && isStoreOpen"
        class="flex items-center gap-3 bg-amber-50 rounded-2xl p-3.5"
      >
        <div class="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
          <Icon name="lucide:map-pin-off" size="18" class="text-amber-600" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[13px] font-semibold text-amber-800 leading-tight">Agrega una dirección</p>
          <p class="text-[11px] text-amber-600 mt-0.5">Selecciona tu dirección en la sección de contacto</p>
        </div>
      </div>

      <!-- Payment & Delivery methods -->
      <OrderPaymentCard />

      <!-- Products (editable) -->
      <ClientOnly>
        <OrderProductList v-if="!isCartEmpty" :products="cartStore.cartItems" />

        <!-- Empty cart state -->
        <section v-else class="py-8">
          <div class="flex flex-col items-center text-center">
            <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Icon name="lucide:shopping-bag" size="24" class="text-gray-300" />
            </div>
            <p class="text-[14px] font-semibold text-[#001954]">Tu carrito está vacío</p>
            <p class="text-[12px] text-gray-400 mt-1">Agrega productos para continuar con tu pedido</p>
            <NuxtLink
              to="/"
              class="mt-4 inline-flex items-center gap-2 bg-[#001954] text-white px-5 h-10 rounded-2xl text-[13px] font-semibold active:scale-[0.97] transition-all duration-150 shadow-[0_4px_20px_rgba(0,25,84,0.3)]"
            >
              <Icon name="lucide:store" size="16" />
              <span>Ir a la tienda</span>
            </NuxtLink>
          </div>
        </section>
      </ClientOnly>

      <!-- Contact / Address -->
      <OrderContactCard v-if="!isCartEmpty" ref="contactCardRef" />

      <!-- Summary -->
      <ClientOnly>
        <OrderDetailsCard v-if="!isCartEmpty" />
      </ClientOnly>

      <!-- Validation error -->
      <div
        v-if="orderStore.selectedAddress?.id && !orderStore.isValidAddress"
        class="flex items-center gap-3 bg-red-50 rounded-2xl p-3.5"
      >
        <div class="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <Icon name="lucide:alert-circle" size="18" class="text-red-500" />
        </div>
        <p class="text-[13px] text-red-700 leading-tight">
          Hay un problema con la dirección seleccionada. Intenta con otra.
        </p>
      </div>
    </div>

    <!-- Fixed bottom CTA -->
    <div class="fixed bottom-0 left-0 right-0 z-20 px-5 pb-5 pt-3">
      <div class="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none" />
      <button
        class="relative w-full h-[52px] rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] cursor-pointer"
        :class="isButtonDisabled
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-[#001954] text-white shadow-[0_4px_20px_rgba(0,25,84,0.3)]'"
        :disabled="isButtonDisabled"
        @click="handleCreateOrder"
      >
        <svg
          v-if="isLoading"
          class="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <template v-if="isLoading">Procesando...</template>
        <template v-else-if="isCartEmpty">
          <span>Agrega productos</span>
        </template>
        <template v-else-if="!isStoreOpen">
          <Icon name="lucide:moon" size="18" />
          <span>Vuelve pronto</span>
        </template>
        <template v-else>
          <span>Ordenar</span>
          <span class="text-white/40 mx-1">·</span>
          <span>MXN {{ formatCurrency(cartStore.cart.total) }}</span>
        </template>
      </button>
    </div>
  </main>
</template>
