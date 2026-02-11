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
  <section class="mt-4">
    <div class="flex items-center justify-between mb-4 px-1">
      <h3 class="text-[12px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <Icon name="lucide:receipt" size="14" />
        Resumen
      </h3>
    </div>

    <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/60 space-y-4">
      <!-- Subtotal -->
      <div class="flex justify-between items-center group">
        <span class="text-[14px] font-medium text-gray-500 group-hover:text-[#001954] transition-colors">Subtotal</span>
        <span class="text-[15px] font-bold text-[#001954] tabular-nums">{{ formatCurrency(cartStore.cart.subtotal) }}</span>
      </div>

      <!-- Delivery info -->
      <div class="flex justify-between items-center group">
        <div class="flex items-center gap-2">
          <span class="text-[14px] font-medium text-gray-500 group-hover:text-[#001954] transition-colors">Envío</span>
          <span v-if="formattedDistance" class="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 tabular-nums">
             {{ formattedDistance }}
          </span>
        </div>
        <span class="text-[15px] font-bold text-[#001954] tabular-nums">
          {{ formatCurrency(cartStore.cart.costo_envio || 0) }}
        </span>
      </div>
      
       <!-- Service Fee Advantage -->
      <div class="flex justify-between text-[13px] items-center py-2.5 bg-emerald-50/40 px-3 -mx-3 rounded-xl border border-emerald-100/30">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-500">Tarifa de servicio</span>
            <div class="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide shadow-sm">Ahorro</div>
          </div>
          <span class="font-bold text-emerald-600 flex items-center gap-1.5">
            Gratis
            <span class="text-[11px] text-gray-400 line-through font-normal decoration-gray-300">$25</span>
          </span>
      </div>

      <!-- Divider -->
      <div class="h-px bg-gray-100 my-2"></div>

      <!-- Total -->
      <div class="flex justify-between items-end pt-1">
        <span class="text-[16px] font-black text-[#001954] tracking-tight mb-1">Total</span>
        <span class="text-[24px] font-black text-[#001954] tabular-nums leading-none">{{ formatCurrency(cartStore.cart.total) }}</span>
      </div>
    </div>
    
    <!-- Secure Payment Badge -->
    <div class="flex items-center justify-center gap-1.5 mt-5 opacity-60">
       <Icon name="lucide:shield-check" size="12" class="text-gray-400" />
       <span class="text-[11px] font-medium text-gray-400">Transacción protegida y encriptada</span>
    </div>
  </section>
</template>
