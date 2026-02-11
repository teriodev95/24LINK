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
  <main class="min-h-screen bg-[#F5F7FA] pb-32">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-[#F5F7FA]/90 backdrop-blur-md px-5 py-3 border-b border-gray-100/50">
      <div class="flex items-center gap-4">
        <button
          class="w-10 h-10 rounded-full bg-white flex items-center justify-center active:bg-gray-50 transition-all shadow-sm border border-gray-100 text-[#001954]"
          @click="router.back()"
        >
          <Icon name="lucide:arrow-left" size="20" />
        </button>
        <h1 class="text-[17px] font-bold text-[#001954] -tracking-[0.01em]">Tu pedido</h1>
      </div>
    </div>

    <div class="px-5 space-y-6 pt-2">
      <!-- Store closed banner -->
      <ClientOnly>
        <div
          v-if="!isStoreOpen"
          class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100"
        >
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-[#001954]/5 flex items-center justify-center shrink-0 mt-1">
              <Icon name="lucide:moon" size="20" class="text-[#001954]" />
            </div>
            <div class="flex-1 min-w-0 space-y-2">
              <p class="text-[16px] font-bold text-[#001954] leading-tight">
                Reparto en pausa
              </p>
              <p class="text-[13px] text-gray-500 leading-relaxed">
                Nuestros repartidores se están preparando. El servicio de entrega a domicilio inicia por la noche.
              </p>
              <div class="bg-gray-50 rounded-xl p-3">
                 <p class="text-[12px] text-gray-400 leading-relaxed font-medium">
                   Tu carrito está guardado y listo para cuando activemos el servicio.
                 </p>
              </div>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/vXZ7xbx5iS9YUsYLA"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 w-full h-12 bg-[#001954] text-white rounded-xl text-[14px] font-bold active:scale-[0.98] transition-all duration-150 shadow-lg shadow-[#001954]/20 mt-5"
          >
            <Icon name="lucide:map-pin" size="18" />
            <span>Visitar el local</span>
          </a>
        </div>
      </ClientOnly>

      <!-- Address alert -->
      <div
        v-if="!isCartEmpty && !orderStore.selectedAddress?.id && isStoreOpen"
        class="flex items-center gap-4 bg-amber-50 rounded-[20px] p-4 border border-amber-100"
      >
        <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
          <Icon name="lucide:map-pin-off" size="20" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[14px] font-bold text-amber-800 leading-tight">Agrega una dirección</p>
          <p class="text-[12px] font-medium text-amber-600 mt-0.5">Selecciona tu dirección en la sección de contacto</p>
        </div>
      </div>

      <!-- Payment & Delivery methods -->
      <!-- We don't wrap this because the buttons inside are cards themselves -->
      <OrderPaymentCard />

      <!-- Products (editable) -->
      <ClientOnly>
        <div v-if="!isCartEmpty" class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100/60 transition-all hover:shadow-md">
           <div class="flex items-center gap-2 mb-4">
              <Icon name="lucide:shopping-bag" size="16" class="text-gray-400" />
              <h3 class="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Productos</h3>
           </div>
           
           <OrderProductList :products="cartStore.cartItems" />
           
           <!-- Empty cart state inside product list container would be weird, check logic -->
        </div>

        <!-- Empty cart state (Fullscreen usually) -->
        <section v-else class="py-12">
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-6">
              <Icon name="lucide:shopping-bag" size="32" class="text-gray-300" />
            </div>
            <p class="text-[18px] font-bold text-[#001954] mb-2">Tu carrito está vacío</p>
            <p class="text-[14px] text-gray-400 mb-8 max-w-[240px]">Agrega tus bebidas y snacks favoritos para continuar.</p>
            <NuxtLink
              to="/"
              class="inline-flex items-center gap-2 bg-[#001954] text-white px-8 h-12 rounded-full text-[14px] font-bold active:scale-[0.97] transition-all duration-150 shadow-lg shadow-[#001954]/20 hover:shadow-xl hover:shadow-[#001954]/30"
            >
              <Icon name="lucide:store" size="18" />
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
        class="flex items-center gap-3 bg-red-50 rounded-2xl p-4 border border-red-100"
      >
        <div class="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <Icon name="lucide:alert-circle" size="18" class="text-red-500" />
        </div>
        <p class="text-[13px] font-medium text-red-700 leading-tight">
          Hay un problema con la dirección seleccionada. Intenta con otra.
        </p>
      </div>
    </div>

    <!-- Fixed bottom CTA -->
    <div class="fixed bottom-0 left-0 right-0 z-20 px-5 pb-6 pt-4 bg-gradient-to-t from-[#F5F7FA] via-[#F5F7FA]/95 to-transparent">
      <button
        class="relative w-full h-[56px] rounded-2xl font-bold text-[16px] flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-xl shadow-[#001954]/25 hover:shadow-2xl hover:shadow-[#001954]/30"
        :class="isButtonDisabled
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          : 'bg-[#001954] text-white'"
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
          <span>💤 Reparto no disponible aún</span>
        </template>
        <template v-else>
          <span>Ordenar</span>
          <span class="text-white/30 font-light">|</span>
          <span>MXN {{ formatCurrency(cartStore.cart.total) }}</span>
        </template>
      </button>
    </div>
  </main>
</template>
