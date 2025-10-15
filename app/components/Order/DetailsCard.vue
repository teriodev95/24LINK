<script setup lang="ts">
const cartStore = useCartStore()
const orderStore = useOrderStore()

interface Props {
  showPaymentMethod?: boolean
}

defineProps<Props>()

// Formatear distancia
const formattedDistance = computed(() => {
  if (!orderStore.deliveryDistance) return '0 km'
  const km = orderStore.deliveryDistance / 1000
  return `${km.toFixed(2)} km`
})
</script>

<template>
  <UISection title="Detalles del pago">
    <div class="space-y-4">
      <p class="flex justify-between">
        <span class="text-secondary">Total en productos</span>
        <span class="text-primary">{{ formatCurrency(cartStore.cart.subtotal) }}</span>
      </p>

      <!-- Información de la ruta -->
      <div v-if="orderStore.deliveryDistance" class="bg-blue-50 p-3 rounded-lg">
        <p class="text-xs text-gray-600 mb-2 font-semibold">📍 Información de entrega</p>
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-700">Distancia</span>
          <span class="font-semibold text-blue-700">{{ formattedDistance }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-700">Tiempo de entrega estimado</span>
          <span class="font-semibold text-blue-700">30 a 35 minutos</span>
        </div>
      </div>

      <p class="flex justify-between">
        <span class="text-secondary">Tarifa de entrega</span>
        <span class="text-primary">{{ formatCurrency(cartStore.cart.costo_envio || 0) }}</span>
      </p>

      <p v-if="showPaymentMethod" class="flex justify-between">
        <span class="text-primary text-xs">Método de pago</span>
        <span class="text-primary text-xs">💳 Tarjeta</span>
      </p>

      <hr class="border-t-2 border-[#898989]">

      <p class="flex justify-between items-center">
        <span class="text-secondary">Total</span>
        <span class="text-lg font-bold">{{ formatCurrency(cartStore.cart.total) }}</span>
      </p>
    </div>
  </UISection>
</template>
