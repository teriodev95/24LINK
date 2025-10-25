<script lang="ts" setup>
import type { OrderWithAddress } from '~/interfaces';

interface Props {
  order: OrderWithAddress
}

defineProps<Props>()

// Formatear dirección
const formatAddress = (direccion: OrderWithAddress['direccion']) => `${direccion.calle} #${direccion.numero_exterior}`;
</script>

<template>
  <NuxtLink :to="`/status-pedido?pedido=${order.numero_pedido}`"
    class="flex-shrink-0 min-w-full hover:bg-green-800/30 transition-all duration-200">
    <div class="flex items-center justify-between px-4 py-3">
      <!-- Contenido izquierdo -->
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <!-- Punto titilante verde -->
        <div class="relative flex-shrink-0">
          <div class="w-3 h-3 bg-green-300 rounded-full animate-ping absolute" />
          <div class="w-3 h-3 bg-green-200 rounded-full relative" />
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
</template>