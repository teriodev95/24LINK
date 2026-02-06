<script setup lang="ts">
import formatCurrency from '~/utils/formatCurrency'

const { isAuthenticated } = useAuth()
const { userOrders: orders, isLoading, loadUserOrders } = useOrderApi()

if (!isAuthenticated.value) {
  navigateTo('/verificacion')
}

loadUserOrders()
</script>

<template>
  <main class="min-h-screen bg-white pb-36">
    <div class="px-5 pt-4 pb-2">
      <h1 class="text-[20px] font-bold text-[#001954] leading-tight">Mis Pedidos</h1>
      <p class="text-[12px] text-gray-400 mt-0.5">Historial de pedidos</p>
    </div>

    <!-- Skeleton -->
    <div v-if="isLoading && orders.length === 0" class="px-5 space-y-2 animate-pulse">
      <div v-for="i in 4" :key="i" class="bg-gray-50/80 rounded-2xl p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 space-y-2">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-gray-200" />
              <div class="h-4 w-32 bg-gray-200 rounded" />
            </div>
            <div class="h-3 w-44 bg-gray-100 rounded" />
          </div>
          <div class="space-y-1.5 flex flex-col items-end">
            <div class="h-4 w-20 bg-gray-200 rounded" />
            <div class="h-3 w-14 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="orders.length === 0" class="flex flex-col items-center justify-center py-16 px-5">
      <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <Icon name="lucide:package-open" size="24" class="text-gray-300" />
      </div>
      <p class="text-[14px] font-semibold text-[#001954]">Sin pedidos aún</p>
      <p class="text-[12px] text-gray-400 mt-1">Tu historial de pedidos aparecerá aquí</p>
    </div>

    <!-- Orders list -->
    <div v-else class="px-5 space-y-2 mt-1">
      <NuxtLink
        v-for="order in orders"
        :key="order.id"
        :to="`/status-pedido?pedido=${order.numero_pedido}`"
        class="block bg-gray-50/80 rounded-2xl p-4 active:scale-[0.98] active:bg-gray-100 transition-all duration-150"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span
                class="inline-block w-2 h-2 rounded-full shrink-0"
                :class="order.estado === 'completado' ? 'bg-emerald-500' : order.estado === 'cancelado' ? 'bg-red-500' : 'bg-amber-500'"
              />
              <span class="text-[13px] font-semibold text-[#001954] truncate">
                {{ order.numero_pedido }}
              </span>
            </div>
            <p class="text-[12px] text-gray-400 mt-0.5 truncate">
              {{ order.direccion.calle }} #{{ order.direccion.numero_exterior }}
            </p>
          </div>
          <div class="text-right ml-3 shrink-0">
            <span class="text-[13px] font-bold text-[#001954]">
              MXN {{ formatCurrency(order.total) }}
            </span>
            <p class="text-[11px] text-gray-400 capitalize mt-0.5">{{ order.estado }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>

    <UIBottomNav />
  </main>
</template>
