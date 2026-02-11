<script setup lang="ts">
import formatCurrency from '~/utils/formatCurrency'

const route = useRoute()
const router = useRouter()
const { order, isLoading, error, loadOrderByNumber } = useOrderApi()

const orderNumber = computed(() => route.query.pedido as string)

// Last update tracking
const lastUpdated = ref<Date | null>(null)
const isRefreshing = ref(false)
const previousStatus = ref<string | null>(null)
const timeUntilNextRefresh = ref(30)
const countdownInterval = ref<NodeJS.Timeout | null>(null)

const lastUpdatedLabel = computed(() => {
  if (!lastUpdated.value) return ''
  return lastUpdated.value.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
})

const orderDate = computed(() => {
  if (!order.value) return ''
  const date = new Date(order.value.created_at)
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
})

// Status display helper for the header
const statusDisplay = computed(() => {
  if (!order.value) return null
  
  const map: Record<string, { title: string; desc: string }> = {
    'nuevo': { 
      // Pedido recibido
      title: 'Pedido recibido', 
      desc: 'Tu pedido ya está con nosotros. Estamos arrancando para llevártelo, tú tranqui.' 
    },
    'aceptado': { 
      // Aceptado
      title: 'Listo.', 
      desc: 'Tu pedido quedó confirmado y ya lo estamos preparando.' 
    },
    'en_ruta': { 
      // En camino
      title: 'Tu pedido ya va rumbo a ti.', 
      desc: 'La fiesta está por llegar.' 
    },
    'completado': { 
      // Entregado
      title: 'Pedido entregado.', 
      desc: 'Disfrútalo y que no se apague la noche.' 
    },
    'cancelado': { 
      title: 'Cancelado', 
      desc: 'El pedido fue cancelado.' 
    }
  }
  
  return map[order.value.estado] || { title: 'Estado Desconocido', desc: 'Consultando...' }
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
  resetAutoRefresh()
}

const startAutoRefresh = () => {
  timeUntilNextRefresh.value = 30
  countdownInterval.value = setInterval(() => {
    timeUntilNextRefresh.value--
    if (timeUntilNextRefresh.value <= 0) {
      handleRefresh()
    }
  }, 1000)
}

const stopAutoRefresh = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
}

const resetAutoRefresh = () => {
  stopAutoRefresh()
  if (order.value && order.value.estado !== 'completado' && order.value.estado !== 'cancelado') {
    startAutoRefresh()
  }
}

const refreshProgress = computed(() => {
  return ((30 - timeUntilNextRefresh.value) / 30) * 100
})

onMounted(async () => {
  if (!orderNumber.value) {
    router.push('/')
    return
  }
  await loadOrder()
  if (order.value && order.value.estado !== 'completado' && order.value.estado !== 'cancelado') {
    startAutoRefresh()
  }
})

onUnmounted(() => {
  stopAutoRefresh()
})

watch(() => order.value?.estado, (newStatus, oldStatus) => {
  if (oldStatus && newStatus !== oldStatus) {
    previousStatus.value = oldStatus
  }
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
  description: "Sigue el estado de tu pedido de bebidas y botanas en tiempo real.",
  robots: "noindex, follow",
  viewport: "width=device-width, initial-scale=1",
});
</script>

<template>
  <main class="min-h-screen bg-[#F5F7FA] pb-32">
    <!-- Back Button (outside stacking context) -->
    <NuxtLink to="/" class="fixed top-4 left-4 z-40 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center active:scale-95 transition-all">
      <Icon name="lucide:arrow-left" size="20" class="text-[#001954]" />
    </NuxtLink>

    <!-- Map Header Background (Visual Certainty) -->
    <div class="fixed top-0 left-0 right-0 h-[320px] bg-slate-200 z-0 overflow-hidden">
      <!-- Simulated Map Pattern -->
      <div class="absolute inset-0 opacity-40 bg-slate-100"
           style="background-image: radial-gradient(#94A3B8 1px, transparent 1px); background-size: 20px 20px;"></div>

      <!-- Abstract Roads/Path -->
      <svg class="absolute inset-0 w-full h-full text-white/40 pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
         <path d="M-10,150 Q100,100 200,150 T410,120" stroke="currentColor" stroke-width="12" fill="none" />
         <path d="M50,0 Q80,100 50,300" stroke="currentColor" stroke-width="8" fill="none" />
      </svg>

      <!-- Gradient overlay for text readability -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#001954]/5 via-transparent to-[#F5F7FA]" />
      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F7FA] to-transparent" />

      <!-- Live Status Island -->
      <div class="absolute top-[80px] left-0 right-0 px-6 flex flex-col items-center z-10 w-full">
        <div v-if="order" class="flex flex-col items-center animate-fade-in-up w-full">
             
            <!-- Status Badge -->
             <div v-if="order.estado === 'completado'" class="bg-emerald-500 text-white px-5 py-2.5 rounded-full text-base font-bold shadow-lg shadow-emerald-500/20 mb-3 flex items-center gap-2 transform transition-all duration-500 hover:scale-105">
                <Icon name="lucide:check-circle-2" size="20" />
                Pedido Entregado
            </div>
            <div v-else-if="order.estado === 'cancelado'" class="bg-red-500 text-white px-5 py-2.5 rounded-full text-base font-bold shadow-lg shadow-red-500/20 mb-3 flex items-center gap-2">
                <Icon name="lucide:x-circle" size="20" />
                Pedido Cancelado
            </div>
            
            <!-- Active Status Card  -->
            <div v-else class="w-full max-w-sm bg-white/80 backdrop-blur-md border border-white/60 px-6 py-5 rounded-3xl shadow-xl shadow-[#001954]/5 flex flex-col items-center text-center transform transition-all hover:translate-y-[-2px]">
               <!-- Description (Top) -->
               <span class="text-[13px] text-gray-500 font-medium mb-1 leading-snug max-w-[90%] mx-auto">
                 {{ statusDisplay?.desc }}
               </span>
               
               <!-- Title (Main) -->
               <h2 class="text-2xl font-black text-[#001954] -tracking-tight leading-none mt-1">
                  {{ statusDisplay?.title }}
               </h2>
            </div>

            <!-- Motorcycle Icon Floating -->
            <div v-if="order.estado === 'en_ruta'" class="mt-6 animate-bounce-slow">
               <div class="w-16 h-16 rounded-full bg-[#001954] flex items-center justify-center shadow-lg shadow-[#001954]/40 border-4 border-white">
                  <Icon name="lucide:bike" class="text-white" size="32" />
               </div>
            </div>
             <!-- Preparation Icon Floating -->
            <div v-else-if="order.estado === 'aceptado'" class="mt-6 animate-pulse">
               <div class="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/40 border-4 border-white">
                  <Icon name="lucide:package-open" class="text-white" size="32" />
               </div>
            </div>

        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="relative z-10 pt-[280px] px-4 space-y-5 max-w-lg mx-auto">
      
      <!-- Loading State -->
      <div v-if="isLoading && !isRefreshing" class="bg-white rounded-[24px] p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
        <UILoading :size="60" />
        <p class="text-sm text-gray-400 mt-4 font-medium animate-pulse">Localizando tu pedido...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-[24px] p-8 shadow-xl shadow-slate-200/50 text-center">
         <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="lucide:alert-circle" class="text-red-500" size="24" />
         </div>
         <p class="text-[#001954] font-semibold">No se pudo cargar la información</p>
         <p class="text-[12px] text-gray-400 mt-1 mb-3">{{ error }}</p>
         <NuxtLink to="/" class="px-5 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors">Volver al inicio</NuxtLink>
      </div>

      <!-- Active Order Content -->
      <div v-else-if="order" class="space-y-4">
        
        <!-- Timeline Card -->
        <div class="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-visible">
           <!-- Header with Live Pulse -->
           <div class="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
              <div class="flex flex-col">
                 <span class="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Pedido</span>
                 <span class="text-sm font-bold text-[#001954] font-mono">#{{ order.numero_pedido }}</span>
              </div>
              
              <div v-if="order.estado !== 'completado' && order.estado !== 'cancelado'" class="flex items-center gap-2 bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-100/50 shadow-sm">
                  <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span class="text-[10px] font-bold text-emerald-700 tracking-wide">EN VIVO</span>
              </div>
           </div>
           
           <div class="p-2">
             <OrderStatusStepper 
                :current-status="order.estado" 
                :order-number="order.numero_pedido"
                :order-date="orderDate"
                :created-at="order.created_at"
                :updated-at="order.updated_at"
              />
           </div>
        </div>

        <!-- Driver Card (Only when En Ruta) -->
        <OrderDeliveryDriverCard
          v-if="order.estado === 'en_ruta' && order.repartidor"
          :driver-name="order.repartidor.nombre"
          :driver-phone="order.repartidor.telefono"
          :delivery-address="`${order.direccion.calle} ${order.direccion.numero_exterior}`"
        />

        <!-- Info Grid -->
        <div class="grid grid-cols-1 gap-4">
            <!-- Address Card -->
            <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/50 relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
                <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon name="lucide:map" size="60" class="text-[#001954]" />
                </div>
                
                <div class="flex items-start gap-4 relative z-10">
                   <div class="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 text-[#001954]">
                      <Icon name="lucide:map-pin" size="20" />
                   </div>
                   <div>
                      <p class="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Entregar en</p>
                      <p class="text-[14px] font-bold text-[#001954] leading-snug">
                        {{ order.direccion.calle }} {{ order.direccion.numero_exterior }}
                      </p>
                      <p class="text-[13px] text-gray-500 mt-0.5">{{ order.direccion.colonia }}</p>
                      <p v-if="order.direccion.referencias" class="text-[12px] text-gray-400 mt-2 bg-gray-50 p-2 rounded-lg italic border border-gray-100">
                        "{{ order.direccion.referencias }}"
                      </p>
                   </div>
                </div>
            </div>

            <!-- Receipt Card -->
            <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/50">
               <div class="flex items-center justify-between mb-5">
                   <p class="text-[10px] text-gray-400 font-bold tracking-widest uppercase flex items-center gap-2">
                      <Icon name="lucide:receipt" size="14" />
                      Ticket de compra
                   </p>
                   <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100/50 border border-gray-100">
                       <Icon :name="getPaymentMethod(order.medio_pago).icon" size="12" class="text-gray-500" />
                       <span class="text-[11px] font-bold text-gray-600 capitalize">{{ getPaymentMethod(order.medio_pago).label }}</span>
                   </div>
               </div>

                <div class="space-y-3">
                  <div class="flex justify-between text-[13px] group cursor-pointer" @click="$refs.detailsRef.toggleAttribute('open')">
                     <span class="text-gray-500 group-hover:text-[#001954] transition-colors">Productos ({{ order.productos.length }})</span>
                     <div class="flex items-center gap-1 group-hover:text-[#001954] transition-colors">
                        <span class="font-medium">Ver detalle</span>
                        <Icon name="lucide:chevron-down" size="12" />
                     </div>
                  </div>

                  <!-- Collapsible Product Details -->
                  <details ref="detailsRef" class="hidden-marker">
                     <summary class="hidden"></summary>
                     <div class="pt-2 pb-4">
                        <OrderProductList :products="order.productos" readonly />
                     </div>
                  </details>

                  <div class="w-full h-px bg-gray-100 my-2"></div>

                  <div class="flex justify-between text-[13px]">
                     <span class="text-gray-500">Subtotal</span>
                     <span class="font-medium text-[#001954]">{{ formatCurrency(order.subtotal) }}</span>
                  </div>
                  <div class="flex justify-between text-[13px]">
                     <span class="text-gray-500">Envío</span>
                     <span class="font-medium text-[#001954]">{{ order.costo_envio === 0 ? 'Gratis' : formatCurrency(order.costo_envio) }}</span>
                  </div>
                  <div v-if="order.descuento > 0" class="flex justify-between text-[13px]">
                    <span class="text-gray-500">Descuento</span>
                    <span class="font-medium text-emerald-600">-{{ formatCurrency(order.descuento) }}</span>
                  </div>

                  <!-- Service Fee Advantage -->
                  <div class="flex justify-between text-[13px] items-center py-1 bg-emerald-50/50 px-2 -mx-2 rounded-lg border border-emerald-100/30">
                     <div class="flex items-center gap-2">
                        <span class="text-gray-500">Tarifa de servicio</span>
                        <div class="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Ahorraste</div>
                     </div>
                     <span class="font-bold text-emerald-600 flex items-center gap-1">
                        Gratis
                        <span class="text-[10px] text-gray-400 line-through font-normal">$25</span>
                     </span>
                  </div>
                  
                  <div class="pt-3 mt-1 border-t border-dashed border-gray-200 flex justify-between items-center">
                     <span class="text-[14px] font-black text-[#001954]">TOTAL</span>
                     <span class="text-[18px] font-black text-[#001954]">{{ formatCurrency(order.total) }}</span>
                  </div>
               </div>
            </div>
        </div>
      </div>
      
      <!-- No Order State -->
      <div v-else class="bg-white rounded-[24px] p-8 shadow-xl shadow-slate-200/50 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
           <Icon name="lucide:search-x" class="text-gray-400" size="28" />
        </div>
        <p class="text-[#001954] font-bold text-lg mb-1">Pedido no encontrado</p>
        <p class="text-sm text-gray-400 mb-4">Verifica el número de pedido intenta nuevamente.</p>
        <NuxtLink to="/" class="inline-flex items-center justify-center px-6 py-2.5 bg-[#001954] text-white rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-[#001954]/20 transition-all">Ir al inicio</NuxtLink>
      </div>

    </div>

    <!-- Floating status bar (bottom) -->
    <ClientOnly>
      <div v-if="order && lastUpdated && order.estado !== 'completado' && order.estado !== 'cancelado'" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex justify-center w-full pointer-events-none">
        <button
          @click="handleRefresh"
          :disabled="isRefreshing"
          class="relative h-12 rounded-full bg-[#001954] text-white shadow-[0_8px_30px_rgba(0,25,84,0.4)] overflow-hidden group transition-transform active:scale-95 pointer-events-auto"
        >
           <!-- Background Progress Fill (Subtle) -->
           <div 
              class="absolute inset-y-0 left-0 bg-white/10 transition-all duration-1000 ease-linear"
              :style="{ width: `${refreshProgress}%` }"
           />

           <!-- Content Centered -->
           <div class="relative z-10 flex items-center justify-center gap-3 px-6 h-full min-w-[200px]">
              <div class="relative w-4 h-4 flex items-center justify-center">
                  <Icon 
                    name="lucide:refresh-cw" 
                    size="16" 
                    class="transition-transform duration-700" 
                    :class="{ 'animate-spin': isRefreshing }" 
                  />
               </div>
               
               <div class="flex flex-col items-center leading-none">
                 <span class="text-[9px] font-bold text-white/60 uppercase tracking-widest mb-0.5 text-center">Siguiente actualización</span>
                 <span class="text-[13px] font-bold tabular-nums text-center">
                    {{ isRefreshing ? 'Actualizando...' : `en ${timeUntilNextRefresh} segundos` }}
                 </span>
               </div>
           </div>
        </button>
      </div>
    </ClientOnly>

  </main>
</template>

<style scoped>
.font-feature-settings-tnum {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-bounce-slow {
  animation: bounceSlow 3s infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceSlow {
  0%, 100% {
    transform: translateY(-5%);
  }
  50% {
    transform: translateY(5%);
  }
}

.hidden-marker {
  /* Hide the default marker */
}
.hidden-marker > summary {
  list-style: none;
}
.hidden-marker > summary::-webkit-details-marker {
  display: none;
}
</style>
