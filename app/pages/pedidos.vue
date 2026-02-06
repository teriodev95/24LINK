<script setup lang="ts">
const { isAuthenticated } = useAuth()
const { userOrders: orders, isLoading, loadUserOrders } = useOrderApi()

if (!isAuthenticated.value) {
  navigateTo('/verificacion')
}

await loadUserOrders()
</script>

<template>
  <main class="min-h-screen bg-gray-50 pb-36">
    <div class="px-4 pt-4 pb-2">
      <h1 class="text-2xl font-bold text-[#001954]">Mis Pedidos</h1>
      <p class="text-sm text-gray-500 mt-1">Historial de pedidos</p>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <UILoading :size="80" />
    </div>

    <div v-else-if="orders.length === 0" class="flex flex-col items-center justify-center py-16 px-4">
      <LucidePackageOpen class="w-16 h-16 text-gray-300 mb-4" />
      <p class="text-gray-500 text-center">Tu historial de pedidos aparecerá aquí</p>
    </div>

    <div v-else class="px-4 space-y-3 mt-2">
      <NuxtLink
        v-for="order in orders"
        :key="order.id"
        :to="`/status-pedido?pedido=${order.numero_pedido}`"
        class="block bg-white rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span
                class="inline-block w-2 h-2 rounded-full"
                :class="order.estado === 'completado' ? 'bg-green-500' : order.estado === 'cancelado' ? 'bg-red-500' : 'bg-yellow-500'"
              />
              <span class="text-sm font-semibold text-[#001954] truncate">
                {{ order.numero_pedido }}
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-1 truncate">
              {{ order.direccion.calle }} #{{ order.direccion.numero_exterior }}
            </p>
          </div>
          <div class="text-right ml-3">
            <span class="text-sm font-bold text-[#001954]">
              MXN {{ formatCurrency(order.total) }}
            </span>
            <p class="text-xs text-gray-400 capitalize mt-0.5">{{ order.estado }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>

    <UIBottomNav />
  </main>
</template>
