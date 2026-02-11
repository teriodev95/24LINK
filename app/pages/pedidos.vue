<script setup lang="ts">
import formatCurrency from '~/utils/formatCurrency'

const { isAuthenticated } = useAuth()
const { userOrders: orders, isLoading, loadUserOrders } = useOrderApi()

onMounted(() => {
  if (isAuthenticated.value) {
    loadUserOrders()
  } else {
    navigateTo('/verificacion')
  }
})

const activeTab = ref<'active' | 'history'>('active')

const activeOrders = computed(() => orders.value.filter(o => ['nuevo', 'aceptado', 'en_ruta'].includes(o.estado)))
const pastOrders = computed(() => orders.value.filter(o => ['completado', 'cancelado'].includes(o.estado)))

const filteredOrders = computed(() => activeTab.value === 'active' ? activeOrders.value : pastOrders.value)

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'nuevo': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'aceptado': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
    case 'en_ruta': return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'completado': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'cancelado': return 'bg-red-50 text-red-600 border-red-100'
    default: return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'nuevo': return 'Confirmando'
    case 'aceptado': return 'Preparando'
    case 'en_ruta': return 'En camino'
    case 'completado': return 'Entregado'
    case 'cancelado': return 'Cancelado'
    default: return status
  }
}
</script>

<template>
  <main class="min-h-screen bg-[#F5F7FA] pb-32">
    <!-- Header -->
    <div class="sticky top-0 z-20 bg-[#F5F7FA]/90 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
      <div class="px-5 pt-safe-top pb-3">
        <h1 class="text-[28px] font-black text-[#001954] -tracking-[0.03em] leading-none mb-1">Mis Pedidos</h1>
        <p class="text-[13px] font-medium text-gray-400">Rastrea y administra tus compras</p>
      </div>

      <!-- Tabs -->
      <div class="flex px-5 pb-0 gap-6 border-b border-gray-200/50">
        <button 
          @click="activeTab = 'active'"
          class="pb-3 text-[14px] font-bold transition-all relative"
          :class="activeTab === 'active' ? 'text-[#001954]' : 'text-gray-400 hover:text-gray-600'"
        >
          En curso
          <span v-if="activeOrders.length > 0" class="ml-1.5 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] align-middle">{{ activeOrders.length }}</span>
          <div v-if="activeTab === 'active'" class="absolute bottom-0 left-0 right-0 h-[3px] bg-[#001954] rounded-t-full"></div>
        </button>
        <button 
          @click="activeTab = 'history'"
          class="pb-3 text-[14px] font-bold transition-all relative"
          :class="activeTab === 'history' ? 'text-[#001954]' : 'text-gray-400 hover:text-gray-600'"
        >
          Historial
          <div v-if="activeTab === 'history'" class="absolute bottom-0 left-0 right-0 h-[3px] bg-[#001954] rounded-t-full"></div>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="px-5 py-6 space-y-4">
      
      <!-- Loading State -->
      <div v-if="isLoading && orders.length === 0" class="space-y-4 animate-pulse">
        <div v-for="i in 3" :key="i" class="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 h-32"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Icon name="lucide:package-search" size="28" class="text-gray-300" />
        </div>
        <h3 class="text-[#001954] font-bold text-lg mb-1">
          {{ activeTab === 'active' ? 'No tienes pedidos en curso' : 'Sin historial de pedidos' }}
        </h3>
        <p class="text-gray-400 text-sm max-w-[200px] mb-6">
          {{ activeTab === 'active' ? 'Tus pedidos activos aparecerán aquí.' : 'Tus pedidos anteriores aparecerán aquí.' }}
        </p>
        <NuxtLink 
          to="/" 
          class="bg-[#001954] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#001954]/20 active:scale-95 transition-transform"
        >
          Ir a la tienda
        </NuxtLink>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-4 animate-fade-in-up">
        <NuxtLink
          v-for="order in filteredOrders"
          :key="order.id"
          :to="`/status-pedido?pedido=${order.numero_pedido}`"
          class="group block bg-white rounded-[24px] p-5 shadow-sm border border-gray-100/60 active:scale-[0.98] transition-all hover:shadow-md hover:border-gray-200"
        >
          <div class="flex justify-between items-start mb-4">
             <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-[#001954] group-hover:border-[#001954] transition-colors">
                   <Icon name="lucide:package" size="18" class="text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                   <p class="text-[15px] font-bold text-[#001954] leading-tight group-hover:text-emerald-600 transition-colors">
                      Pedido #{{ order.numero_pedido }}
                   </p>
                   <p class="text-[11px] text-gray-400 mt-0.5">
                      {{ formatDate(order.created_at) }}
                   </p>
                </div>
             </div>
             <span 
               class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border"
               :class="getStatusColor(order.estado)"
             >
                {{ getStatusLabel(order.estado) }}
             </span>
          </div>
          
          <div class="bg-gray-50/50 rounded-xl p-3 border border-gray-100/50 mb-4 group-hover:bg-gray-50 transition-colors">
             <div class="flex items-start gap-2">
                <Icon name="lucide:map-pin" size="14" class="text-gray-400 mt-0.5 shrink-0" />
                <p class="text-[12px] text-gray-500 font-medium leading-relaxed line-clamp-2">
                   {{ order.direccion.calle }} #{{ order.direccion.numero_exterior }}
                </p>
             </div>
          </div>

          <div class="flex items-center justify-between border-t border-gray-50 pt-3">
             <p class="text-[12px] font-medium text-gray-400">Total</p>
             <div class="flex items-center gap-2">
                <span class="text-[16px] font-black text-[#001954]">
                   {{ formatCurrency(order.total) }}
                </span>
                <Icon name="lucide:chevron-right" size="16" class="text-gray-300 group-hover:translate-x-1 transition-transform" />
             </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <UIBottomNav />
  </main>
</template>

<style scoped>
.pt-safe-top {
  padding-top: max(env(safe-area-inset-top), 20px);
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
