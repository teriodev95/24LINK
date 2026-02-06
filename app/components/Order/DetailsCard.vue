<script setup lang="ts">
import formatCurrency from '~/utils/formatCurrency'

const cartStore = useCartStore()
const orderStore = useOrderStore()

const formattedDistance = computed(() => {
  if (!orderStore.deliveryDistance) return null
  const km = orderStore.deliveryDistance / 1000
  return `${km.toFixed(1)} km`
})
</script>

<template>
  <section>
    <p class="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Resumen</p>

    <div class="bg-gray-50/80 rounded-2xl p-4 space-y-3">
      <!-- Subtotal -->
      <div class="flex justify-between items-center">
        <span class="text-[13px] text-gray-500">Subtotal</span>
        <span class="text-[13px] font-semibold text-[#001954]">MXN {{ formatCurrency(cartStore.cart.subtotal) }}</span>
      </div>

      <!-- Delivery info -->
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-1.5">
          <span class="text-[13px] text-gray-500">Envío</span>
          <span v-if="formattedDistance" class="text-[11px] text-gray-400">({{ formattedDistance }})</span>
        </div>
        <span class="text-[13px] font-semibold text-[#001954]">
          MXN {{ formatCurrency(cartStore.cart.costo_envio || 0) }}
        </span>
      </div>

      <!-- ETA -->
      <div v-if="orderStore.deliveryDistance" class="flex justify-between items-center">
        <span class="text-[13px] text-gray-500">Tiempo estimado</span>
        <span class="text-[13px] font-medium text-gray-500">30–35 min</span>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-200" />

      <!-- Total -->
      <div class="flex justify-between items-center">
        <span class="text-[15px] font-bold text-[#001954]">Total</span>
        <span class="text-[17px] font-bold text-[#001954]">MXN {{ formatCurrency(cartStore.cart.total) }}</span>
      </div>
    </div>
  </section>
</template>
