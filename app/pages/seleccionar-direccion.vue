<script setup lang="ts">
import type { Address } from '~/interfaces'
import formatCurrency from '~/utils/formatCurrency'

const router = useRouter()
const orderStore = useOrderStore()
const cartStore = useCartStore()
const { $toast } = useNuxtApp()
const { createOrder, isLoading } = useOrderApi()
const { addresses, refreshAddresses } = useAddresses()
const { recalculateOnAddressChange } = useDeliveryCalculator()
const { userPhone } = useAuth()

// Asegurar que el store tenga phone y defaults inicializados
orderStore.initializeDefaults()
if (userPhone.value) {
  orderStore.setPhone(userPhone.value)
}

const selectedId = ref<string | null>(null)
const isCalculating = ref(false)
const calculationDone = ref(false)
const calculationFailed = ref(false)
const deliveryCost = ref(0)
const deliveryDistance = ref('')

const hasAddresses = computed(() => addresses.value.length > 0)
const subtotal = computed(() => cartStore.cart.subtotal)
const totalWithDelivery = computed(() => subtotal.value + deliveryCost.value)

const selectedAddress = computed(() =>
  addresses.value.find(a => a.id === selectedId.value) ?? null
)

// Al seleccionar una dirección → calcular envío
const selectAddress = async (address: Address) => {
  if (selectedId.value === address.id) {
    selectedId.value = null
    calculationDone.value = false
    calculationFailed.value = false
    orderStore.clearSelectedAddress()
    return
  }

  selectedId.value = address.id
  calculationDone.value = false
  calculationFailed.value = false
  isCalculating.value = true

  orderStore.setSelectedAddress(address)
  orderStore.setCalculatingDelivery(true)

  const result = await recalculateOnAddressChange(address.id)

  orderStore.setCalculatingDelivery(false)
  isCalculating.value = false

  if (result) {
    deliveryCost.value = result.cost
    deliveryDistance.value = result.distanceKm
    calculationDone.value = true
  } else {
    calculationFailed.value = true
    orderStore.clearSelectedAddress()
  }
}

const handleOrder = async () => {
  if (!selectedAddress.value || !calculationDone.value) return

  if (!orderStore.canPlaceOrder) {
    $toast.error('Revisa que todos los datos estén completos')
    return
  }

  const result = await createOrder()

  if (result.success) {
    router.push(`/status-pedido?pedido=${result.numeroPedido}`)
  }
}

const goToNewAddress = () => {
  navigateTo('/ubicacion?from=order')
}

// Sincronizar direcciones con el orderStore
watch(addresses, (newAddresses) => {
  if (newAddresses.length > 0) {
    orderStore.setAddressList(newAddresses)
  }
}, { immediate: true })

onMounted(() => {
  // Siempre refrescar para capturar direcciones nuevas (ej: al volver de /ubicacion)
  refreshAddresses()
})

useSeoMeta({
  title: "Seleccionar dirección - 24 Horas de Fiesta",
  robots: "noindex, follow",
})

definePageMeta({
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  }
})
</script>

<template>
  <main class="min-h-screen bg-[#F5F7FA] pb-72">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-[#F5F7FA]/90 backdrop-blur-md px-5 py-3 border-b border-gray-100/50">
      <div class="flex items-center gap-4">
        <button
          class="w-10 h-10 rounded-full bg-white flex items-center justify-center active:bg-gray-50 transition-all shadow-sm border border-gray-100 text-[#001954]"
          @click="router.back()"
        >
          <Icon name="lucide:arrow-left" size="20" />
        </button>
        <h1 class="text-[17px] font-bold text-[#001954] -tracking-[0.01em]">Dirección de entrega</h1>
      </div>
    </div>

    <div class="px-5 pt-6 space-y-5">
      <!-- Title -->
      <div>
        <h2 class="text-[22px] font-black text-[#001954] leading-tight">
          ¿A dónde van tus pomos? 🍻
        </h2>
        <p class="text-[13px] text-gray-400 font-medium mt-1">
          Selecciona o agrega una dirección de entrega
        </p>
      </div>

      <!-- ==================== -->
      <!-- Estado: CON direcciones -->
      <!-- ==================== -->
      <template v-if="hasAddresses">
        <div class="space-y-2">
          <!-- Nueva dirección card -->
          <button
            class="w-full flex items-center gap-3.5 rounded-2xl px-4 py-4 text-left transition-all duration-150 active:scale-[0.98] border border-dashed border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50"
            @click="goToNewAddress"
          >
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-500 shadow-sm shadow-emerald-500/20">
              <Icon name="lucide:plus" size="20" class="text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[14px] font-bold text-emerald-700 leading-tight">Nueva dirección</p>
              <p class="text-[12px] text-emerald-500 mt-0.5">Seleccionar en el mapa</p>
            </div>
            <Icon name="lucide:map" size="16" class="text-emerald-300 shrink-0" />
          </button>

          <!-- Saved addresses -->
          <button
            v-for="address in addresses"
            :key="address.id"
            class="w-full flex items-center gap-3.5 rounded-2xl px-4 py-4 text-left transition-all duration-200 active:scale-[0.98] border-2"
            :class="selectedId === address.id
              ? 'bg-[#001954] border-[#001954] shadow-lg shadow-[#001954]/15'
              : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'"
            :disabled="isCalculating && selectedId !== address.id"
            @click="selectAddress(address)"
          >
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
              :class="selectedId === address.id ? 'bg-white/15' : 'bg-gray-50 border border-gray-100'"
            >
              <Icon
                name="lucide:home"
                size="18"
                :class="selectedId === address.id ? 'text-white' : 'text-gray-400'"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-[14px] font-bold truncate leading-tight transition-colors"
                :class="selectedId === address.id ? 'text-white' : 'text-[#001954]'"
              >
                {{ address.street }}
              </p>
              <p
                class="text-[12px] truncate mt-0.5 transition-colors"
                :class="selectedId === address.id ? 'text-white/60' : 'text-gray-400'"
              >
                {{ address.colony }}
              </p>
            </div>
            <!-- Calculating spinner -->
            <div v-if="isCalculating && selectedId === address.id" class="shrink-0">
              <div class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
            </div>
            <!-- Check -->
            <div
              v-else-if="selectedId === address.id && calculationDone"
              class="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center shrink-0"
            >
              <Icon name="lucide:check" size="14" class="text-white" />
            </div>
          </button>
        </div>

        <!-- Calculation error -->
        <div v-if="calculationFailed" class="flex items-center gap-2.5 bg-red-50 rounded-2xl px-4 py-3 border border-red-100/50">
          <Icon name="lucide:alert-circle" size="16" class="text-red-400 shrink-0" />
          <p class="text-[12px] text-red-600 font-medium">
            No pudimos calcular el envío para esa dirección. Intenta con otra.
          </p>
        </div>
      </template>

      <!-- ==================== -->
      <!-- Estado: SIN direcciones (cliente nuevo) -->
      <!-- ==================== -->
      <template v-else>
        <div class="flex flex-col items-center text-center py-12">
          <div class="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
            <Icon name="lucide:map-pin" size="36" class="text-emerald-500" />
          </div>
          <p class="text-[15px] text-gray-500 leading-relaxed max-w-[280px] mb-8">
            Aún no tienes direcciones guardadas.
            <span class="font-bold text-[#001954]">Agrega tu primera dirección</span>
            para que sepamos a dónde llegar.
          </p>
          <button
            class="w-full max-w-[320px] h-[52px] rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer hover:bg-emerald-600"
            @click="goToNewAddress"
          >
            <Icon name="lucide:map-pin-plus" size="18" />
            <span>Agregar mi dirección</span>
          </button>
        </div>
      </template>
    </div>

    <!-- Fixed bottom panel -->
    <div class="fixed bottom-0 left-0 right-0 z-20">
      <div class="bg-white rounded-t-[24px] shadow-2xl shadow-black/10 border-t border-gray-100/50 px-5 pt-4 pb-6">

        <!-- Mini resumen de productos (clickeable → vuelve a detalles-orden) -->
        <button
          class="flex items-center gap-2 mb-3 w-full text-left active:opacity-70 transition-opacity"
          @click="navigateTo('/detalles-orden', { replace: true })"
        >
          <div class="flex -space-x-2">
            <div
              v-for="(item, i) in cartStore.cartItems.slice(0, 4)"
              :key="item.id"
              class="w-8 h-8 rounded-full border-2 border-white bg-gray-50 overflow-hidden shadow-sm"
              :style="{ zIndex: 4 - i }"
            >
              <img v-if="item.imagen_url" :src="item.imagen_url" class="w-full h-full object-contain p-0.5" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <Icon name="lucide:package" size="12" class="text-gray-300" />
              </div>
            </div>
            <div
              v-if="cartStore.cartItems.length > 4"
              class="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500 shadow-sm"
            >
              +{{ cartStore.cartItems.length - 4 }}
            </div>
          </div>
          <span class="text-[12px] text-gray-400 font-medium flex-1">
            {{ cartStore.totalItems }} {{ cartStore.totalItems === 1 ? 'producto' : 'productos' }}
          </span>
          <span class="text-[11px] font-medium text-[#001954]/50 flex items-center gap-1">
            Modificar
            <Icon name="lucide:pencil" size="11" />
          </span>
        </button>

        <!-- Resumen de costos (visible cuando hay cálculo) -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="calculationDone" class="mb-3 space-y-1.5">
            <div class="flex justify-between items-center">
              <span class="text-[12px] text-gray-400">Subtotal</span>
              <span class="text-[12px] font-bold text-[#001954] tabular-nums">{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-1.5">
                <span class="text-[12px] text-gray-400">Envío</span>
                <span class="text-[9px] font-bold text-gray-400 bg-gray-50 px-1 py-0.5 rounded border border-gray-100 tabular-nums">{{ deliveryDistance }}</span>
              </div>
              <span class="text-[12px] font-bold text-[#001954] tabular-nums">{{ formatCurrency(deliveryCost) }}</span>
            </div>
            <div class="h-px bg-gray-100"></div>
            <div class="flex justify-between items-center">
              <span class="text-[13px] font-black text-[#001954]">Total</span>
              <span class="text-[17px] font-black text-[#001954] tabular-nums leading-none">{{ formatCurrency(totalWithDelivery) }}</span>
            </div>
          </div>
        </Transition>

        <!-- CTA Button -->
        <!-- Calculating -->
        <button
          v-if="isCalculating"
          class="w-full h-[52px] rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 bg-gray-100 text-gray-300 cursor-not-allowed"
          disabled
        >
          <div class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300/50 border-t-gray-400" />
          <span>Calculando envío...</span>
        </button>

        <!-- Hacer pedido -->
        <button
          v-else-if="calculationDone"
          class="w-full h-[52px] rounded-2xl font-bold text-[16px] flex items-center justify-center gap-3 bg-[#001954] text-white shadow-lg shadow-[#001954]/25 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          :disabled="isLoading"
          @click="handleOrder"
        >
          <template v-if="isLoading">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Procesando...</span>
          </template>
          <template v-else>
            <span>Hacer pedido</span>
            <span class="text-white/30 font-light">|</span>
            <span>MXN {{ formatCurrency(totalWithDelivery) }}</span>
          </template>
        </button>

        <!-- Sin selección -->
        <button
          v-else-if="hasAddresses"
          class="w-full h-[52px] rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 bg-gray-100 text-gray-300 cursor-not-allowed"
          disabled
        >
          <Icon name="lucide:map-pin" size="18" />
          <span>Selecciona una dirección</span>
        </button>
      </div>
    </div>
  </main>
</template>
