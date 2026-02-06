<script setup lang="ts">
import formatCurrency from '~/utils/formatCurrency'

const router = useRouter()
const orderStore = useOrderStore()
const cartStore = useCartStore()
const { $toast } = useNuxtApp()
const { createOrder, isLoading } = useOrderApi()
orderStore.initializeDefaults()

const contactCardRef = ref()

const handleCreateOrder = async () => {
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
      <!-- Address alert -->
      <div
        v-if="!orderStore.selectedAddress?.id"
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
        <OrderProductList :products="cartStore.cartItems" />
      </ClientOnly>

      <!-- Contact / Address -->
      <OrderContactCard ref="contactCardRef" />

      <!-- Summary -->
      <ClientOnly>
        <OrderDetailsCard />
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
        :class="!orderStore.canPlaceOrder || orderStore.calculatingDelivery || isLoading
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-[#001954] text-white shadow-[0_4px_20px_rgba(0,25,84,0.3)]'"
        :disabled="!orderStore.canPlaceOrder || orderStore.calculatingDelivery || isLoading"
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
        <template v-else>
          <span>Ordenar</span>
          <span class="text-white/40 mx-1">·</span>
          <span>MXN {{ formatCurrency(cartStore.cart.total) }}</span>
        </template>
      </button>
    </div>
  </main>
</template>
