<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { order, isLoading, error, loadOrderByNumber } = useOrderDetails()

// Obtener número de pedido de la URL
const orderNumber = computed(() => route.query.pedido as string)

// Cargar pedido al montar
onMounted(async () => {
  if (!orderNumber.value) {
    console.error('❌ No se proporcionó número de pedido')
    router.push('/')
    return
  }

  await loadOrderByNumber(orderNumber.value)
})

// Formatear método de pago
const formatPaymentMethod = (method: string) => {
  const methods: Record<string, string> = {
    'tarjeta': '💳 Tarjeta',
    'efectivo': '💵 Efectivo',
    'mixto': '💳💵 Mixto'
  }
  return methods[method] || method
}
</script>

<template>
  <main class="p-2 space-y-4">
    <UINavbar title="Seguimiento de tu pedido" to="/" />

    <!-- Loading state -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
      <UILoading :size="120" />
      <p class="text-gray-600 mt-4">Cargando pedido...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div class="text-red-600 mb-2">
        <LucideAlertCircle :size="48" class="mx-auto mb-2" />
        <h3 class="font-bold text-lg">Error al cargar el pedido</h3>
      </div>
      <p class="text-red-700 mb-4">{{ error }}</p>
      <UIButtonAction label="Volver al inicio" role="link" to="/" class-name="mx-auto" />
    </div>

    <!-- Order data -->
    <template v-else-if="order">
      <!-- Order number and date -->
      <div class="p-4 border border-[#E6E6E6] rounded-lg">
        <h2 class="text-lg font-bold text-primary mb-1">Pedido #{{ order.numero_pedido }}</h2>
        <p class="text-sm text-secondary">{{ new Date(order.created_at).toLocaleString('es-MX') }}</p>
      </div>

      <!-- Order status -->
      <OrderStatusStepper :current-status="order.estado" />

      <!-- Delivery driver info (only when en_ruta) -->
      <OrderDeliveryDriverCard v-if="order.estado === 'en_ruta' && order.repartidor"
        :driver-name="order.repartidor.nombre" :driver-phone="order.repartidor.telefono"
        :delivery-address="`${order.direccion.calle} ${order.direccion.numero_exterior}`" />

      <!-- Delivery info -->
      <UISection title="Información de entrega">
        <div class="space-y-4">
          <div>
            <p class="text-[#717272] text-xs uppercase tracking-wide mb-1">Dirección</p>
            <p class="text-primary font-bold text-base leading-snug">
              {{ order.direccion.calle }} {{ order.direccion.numero_exterior }}
              {{ order.direccion.numero_interior ? `, ${order.direccion.numero_interior}` : '' }}
            </p>
            <p class="text-primary text-sm mt-0.5">{{ order.direccion.colonia }}</p>
            <p v-if="order.direccion.referencias" class="text-[#717272] text-xs mt-1">
              Ref: {{ order.direccion.referencias }}
            </p>
          </div>
          <div>
            <p class="text-[#717272] text-xs uppercase tracking-wide mb-1">Contacto</p>
            <p class="text-primary font-bold text-base">{{ order.usuario.nombre }}</p>
            <p class="text-primary text-sm">{{ order.usuario.telefono }}</p>
          </div>
          <div v-if="order.instrucciones_entrega">
            <p class="text-[#717272] text-xs uppercase tracking-wide mb-1">Instrucciones</p>
            <p class="text-primary text-sm">{{ order.instrucciones_entrega }}</p>
          </div>
        </div>
      </UISection>

      <!-- Products -->
      <OrderProductList :products="order.productos" />

      <!-- Payment details -->
      <ClientOnly>
        <UISection title="Detalles del pago">
          <div class="space-y-4">
            <p class="flex justify-between">
              <span class="text-secondary">Total en productos</span>
              <span class="text-primary">{{ formatCurrency(order.subtotal) }}</span>
            </p>
            <p class="flex justify-between">
              <span class="text-secondary">Tarifa de entrega</span>
              <span class="text-primary">{{ formatCurrency(order.costo_envio) }}</span>
            </p>
            <p v-if="order.descuento > 0" class="flex justify-between">
              <span class="text-secondary">Descuento</span>
              <span class="text-green-600">-{{ formatCurrency(order.descuento) }}</span>
            </p>
            <p class="flex justify-between">
              <span class="text-primary text-xs">Método de pago</span>
              <span class="text-primary text-xs">{{ formatPaymentMethod(order.medio_pago) }}</span>
            </p>

            <hr class="border-t-2 border-[#898989]">

            <p class="flex justify-between items-center">
              <span class="text-secondary">Total</span>
              <span class="text-lg font-bold">{{ formatCurrency(order.total) }}</span>
            </p>
          </div>
        </UISection>
      </ClientOnly>
    </template>

    <!-- No order found -->
    <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <LucidePackageSearch :size="48" class="mx-auto mb-2 text-yellow-600" />
      <h3 class="font-bold text-lg text-yellow-800 mb-2">Pedido no encontrado</h3>
      <p class="text-yellow-700 mb-4">No pudimos encontrar el pedido solicitado.</p>
      <UIButtonAction label="Volver al inicio" role="link" to="/" class-name="mx-auto" />
    </div>
  </main>
</template>
