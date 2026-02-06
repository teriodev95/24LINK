<script setup lang="ts">
import formatCurrency from '~/utils/formatCurrency'

const route = useRoute()
const router = useRouter()
const { order, isLoading, error, loadOrderByNumber } = useOrderApi()

const orderNumber = computed(() => route.query.pedido as string)

// Last update tracking
const lastUpdated = ref<Date | null>(null)
const isRefreshing = ref(false)

const lastUpdatedLabel = computed(() => {
  if (!lastUpdated.value) return ''
  return lastUpdated.value.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
})

const loadOrder = async () => {
  if (!orderNumber.value) return
  await loadOrderByNumber(orderNumber.value)
  lastUpdated.value = new Date()
}

const handleRefresh = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  await loadOrder()
  isRefreshing.value = false
}

onMounted(async () => {
  if (!orderNumber.value) {
    router.push('/')
    return
  }
  await loadOrder()
})

// Payment method config
const paymentMethodConfig: Record<string, { label: string; icon: string }> = {
  tarjeta: { label: 'Tarjeta', icon: 'lucide:credit-card' },
  efectivo: { label: 'Efectivo', icon: 'lucide:banknote' },
  mixto: { label: 'Mixto', icon: 'lucide:wallet' },
}

const getPaymentMethod = (method: string) => {
  return paymentMethodConfig[method] || { label: method, icon: 'lucide:circle' }
}

useSeoMeta({
  title: "Estado del Pedido - 24 Horas de Fiesta | Seguimiento de Entrega",
  description: "Sigue el estado de tu pedido de bebidas y botanas en tiempo real. Conoce cuándo llegará tu entrega 24/7 a domicilio.",
  keywords: "estado pedido, seguimiento entrega, tracking pedido, 24 horas fiesta, delivery bebidas, status orden",
  author: "24 Horas de Fiesta",

  ogTitle: "Estado del Pedido - 24 Horas de Fiesta",
  ogDescription: "Sigue el estado de tu pedido de bebidas y botanas en tiempo real. Conoce cuándo llegará tu entrega 24/7.",
  ogType: "website",
  ogUrl: "https://24link.pages.dev/status-pedido",
  ogImage: "./images/icono-24link.png",
  ogSiteName: "24 Horas de Fiesta",

  twitterCard: "summary_large_image",
  twitterTitle: "Estado del Pedido - 24 Horas de Fiesta",
  twitterDescription: "Sigue el estado de tu pedido de bebidas y botanas en tiempo real.",
  twitterImage: "./images/icono-24link.png",

  robots: "noindex, follow",
  viewport: "width=device-width, initial-scale=1",
});
</script>

<template>
  <main class="min-h-screen bg-white pb-24">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-5 py-4">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/"
          class="w-10 h-10 rounded-full flex items-center justify-center active:bg-gray-100 transition-colors cursor-pointer"
        >
          <Icon name="lucide:arrow-left" size="20" class="text-[#001954]" />
        </NuxtLink>
        <h1 class="text-[18px] font-bold text-[#001954]">Seguimiento</h1>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading && !isRefreshing" class="flex flex-col items-center justify-center py-16">
      <UILoading :size="120" />
      <p class="text-[13px] text-gray-400 mt-4">Cargando pedido...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="px-5 pt-6">
      <div class="flex flex-col items-center text-center py-10">
        <div class="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-3">
          <Icon name="lucide:alert-circle" size="24" class="text-red-500" />
        </div>
        <p class="text-[14px] font-semibold text-[#001954]">Error al cargar el pedido</p>
        <p class="text-[12px] text-gray-400 mt-1">{{ error }}</p>
        <NuxtLink
          to="/"
          class="mt-4 inline-flex items-center gap-2 bg-[#001954] text-white px-5 h-10 rounded-2xl text-[13px] font-semibold active:scale-[0.97] transition-all duration-150"
        >
          Volver al inicio
        </NuxtLink>
      </div>
    </div>

    <!-- Order data -->
    <div v-else-if="order" class="px-5 space-y-6">
      <!-- Order number card -->
      <div class="bg-gray-50/80 rounded-2xl p-4">
        <p class="text-[15px] font-bold text-[#001954]">Pedido #{{ order.numero_pedido }}</p>
        <p class="text-[12px] text-gray-400 mt-0.5">{{ new Date(order.created_at).toLocaleString('es-MX') }}</p>
      </div>

      <!-- Order status stepper -->
      <OrderStatusStepper :current-status="order.estado" />

      <!-- Delivery driver info (only when en_ruta) -->
      <OrderDeliveryDriverCard
        v-if="order.estado === 'en_ruta' && order.repartidor"
        :driver-name="order.repartidor.nombre"
        :driver-phone="order.repartidor.telefono"
        :delivery-address="`${order.direccion.calle} ${order.direccion.numero_exterior}`"
      />

      <!-- Delivery info -->
      <section>
        <p class="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Entrega</p>

        <div class="bg-gray-50/80 rounded-2xl p-4 space-y-4">
          <div>
            <p class="text-[11px] text-gray-400 uppercase tracking-wider mb-1">Dirección</p>
            <p class="text-[13px] font-semibold text-[#001954] leading-snug">
              {{ order.direccion.calle }} {{ order.direccion.numero_exterior }}
              {{ order.direccion.numero_interior ? `, ${order.direccion.numero_interior}` : '' }}
            </p>
            <p class="text-[12px] text-gray-500 mt-0.5">{{ order.direccion.colonia }}</p>
            <p v-if="order.direccion.referencias" class="text-[11px] text-gray-400 mt-0.5">
              Ref: {{ order.direccion.referencias }}
            </p>
          </div>

          <div class="border-t border-gray-200" />

          <div>
            <p class="text-[11px] text-gray-400 uppercase tracking-wider mb-1">Contacto</p>
            <p class="text-[13px] font-semibold text-[#001954]">{{ order.usuario.nombre }}</p>
            <p class="text-[12px] text-gray-500">{{ order.usuario.telefono }}</p>
          </div>

          <template v-if="order.instrucciones_entrega">
            <div class="border-t border-gray-200" />
            <div>
              <p class="text-[11px] text-gray-400 uppercase tracking-wider mb-1">Instrucciones</p>
              <p class="text-[12px] text-gray-500">{{ order.instrucciones_entrega }}</p>
            </div>
          </template>
        </div>
      </section>

      <!-- Products (readonly) -->
      <OrderProductList :products="order.productos" readonly />

      <!-- Payment details -->
      <section>
        <p class="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Resumen de pago</p>

        <div class="bg-gray-50/80 rounded-2xl p-4 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-[13px] text-gray-500">Subtotal</span>
            <span class="text-[13px] font-semibold text-[#001954]">MXN {{ formatCurrency(order.subtotal) }}</span>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-[13px] text-gray-500">Envío</span>
            <span class="text-[13px] font-semibold text-[#001954]">MXN {{ formatCurrency(order.costo_envio) }}</span>
          </div>

          <div v-if="order.descuento > 0" class="flex justify-between items-center">
            <span class="text-[13px] text-gray-500">Descuento</span>
            <span class="text-[13px] font-semibold text-emerald-600">-MXN {{ formatCurrency(order.descuento) }}</span>
          </div>

          <div class="flex justify-between items-center">
            <div class="flex items-center gap-1.5">
              <Icon :name="getPaymentMethod(order.medio_pago).icon" size="14" class="text-gray-400" />
              <span class="text-[12px] text-gray-400">{{ getPaymentMethod(order.medio_pago).label }}</span>
            </div>
          </div>

          <div class="border-t border-gray-200" />

          <div class="flex justify-between items-center">
            <span class="text-[15px] font-bold text-[#001954]">Total</span>
            <span class="text-[17px] font-bold text-[#001954]">MXN {{ formatCurrency(order.total) }}</span>
          </div>
        </div>
      </section>
    </div>

    <!-- No order found -->
    <div v-else class="px-5 pt-6">
      <div class="flex flex-col items-center text-center py-10">
        <div class="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-3">
          <Icon name="lucide:package-search" size="24" class="text-amber-500" />
        </div>
        <p class="text-[14px] font-semibold text-[#001954]">Pedido no encontrado</p>
        <p class="text-[12px] text-gray-400 mt-1">No pudimos encontrar el pedido solicitado</p>
        <NuxtLink
          to="/"
          class="mt-4 inline-flex items-center gap-2 bg-[#001954] text-white px-5 h-10 rounded-2xl text-[13px] font-semibold active:scale-[0.97] transition-all duration-150"
        >
          Volver al inicio
        </NuxtLink>
      </div>
    </div>

    <!-- Refresh FAB -->
    <ClientOnly>
      <div v-if="order && lastUpdated" class="fixed bottom-0 left-0 right-0 z-20 pb-5 pt-3 px-5">
        <div class="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none" />
        <button
          class="relative w-full h-[48px] rounded-full bg-[#001954] text-white flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(0,25,84,0.3)] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60"
          :disabled="isRefreshing"
          @click="handleRefresh"
        >
          <Icon
            name="lucide:refresh-cw"
            size="16"
            :class="{ 'animate-spin': isRefreshing }"
          />
          <span class="text-[13px] font-semibold">
            {{ isRefreshing ? 'Actualizando...' : `Actualizado a las ${lastUpdatedLabel}` }}
          </span>
        </button>
      </div>
    </ClientOnly>
  </main>
</template>
