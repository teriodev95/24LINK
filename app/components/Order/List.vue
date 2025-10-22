<script lang="ts" setup>
import type { OrderWithAddress } from '~/interfaces';

interface Props {
  orders: OrderWithAddress[]
  isLoading?: boolean
}
withDefaults(defineProps<Props>(), {
  isLoading: false
})

// Formatear dirección
const formatAddress = (direccion: OrderWithAddress['direccion']) => `${direccion.calle} #${direccion.numero_exterior}`;
</script>

<template>
  <!-- Loading state -->
  <section v-if="isLoading" class="fixed top-0 left-0 right-0 z-50 shadow-md">
    <div class="block bg-green-600 animate-pulse">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3 flex-1">
          <div class="w-3 h-3 bg-green-300 rounded-full"></div>
          <div class="flex flex-col gap-1.5">
            <div class="w-32 h-3 bg-green-500 rounded"></div>
            <div class="w-40 h-2 bg-green-500 rounded"></div>
          </div>
        </div>
        <div class="w-6 h-6 bg-green-500 rounded"></div>
      </div>
    </div>
  </section>

  <!-- Orders list - Fixed version estilo Uber Eats -->
  <section v-else-if="orders.length > 0" class="fixed top-0 left-0 right-0 z-50 shadow-md bg-gradient-to-r from-green-600 to-green-700">
    <div class="flex overflow-x-auto scrollbar-hide">
      <NuxtLink v-for="order in orders" :key="order.id" :to="`/status-pedido?pedido=${order.numero_pedido}`"
        class="flex-shrink-0 min-w-full hover:bg-green-800/30 transition-all duration-200">

        <div class="flex items-center justify-between px-4 py-3">
          <!-- Contenido izquierdo -->
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <!-- Punto titilante verde -->
            <div class="relative flex-shrink-0">
              <div class="w-3 h-3 bg-green-300 rounded-full animate-ping absolute"></div>
              <div class="w-3 h-3 bg-green-200 rounded-full relative"></div>
            </div>

            <!-- Información del pedido -->
            <div class="flex flex-col min-w-0 flex-1">
              <span class="text-white font-semibold text-sm leading-tight truncate">
                Pedido en curso • {{ formatCurrency(order.total) }}
              </span>
              <span class="text-green-100 text-xs leading-tight truncate">
                {{ formatAddress(order.direccion) }} • {{ order.numero_pedido }}
              </span>
            </div>
          </div>

          <!-- Flecha derecha -->
          <div class="flex-shrink-0">
            <LucideChevronRight :size="24" class="text-white" />
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
/* Ocultar scrollbar pero mantener funcionalidad */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>