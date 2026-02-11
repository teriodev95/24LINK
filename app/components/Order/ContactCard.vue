<script setup lang="ts">
import type { Address } from '~/interfaces'

const orderStore = useOrderStore()
const { addresses, isLoading, loadAddresses } = useAddresses()
const { recalculateOnAddressChange, isCalculating, calculationError } = useDeliveryCalculator()
const { userPhone } = useAuth()

// Referencia para el scroll y animación
const contactCardRef = ref<HTMLElement>()
const showBorderAnimation = ref(false)
const addressWithError = ref<string | null>(null)

// Computed para el teléfono del usuario
const currentPhone = computed(() => userPhone.value || orderStore.phone)

// Computed para verificar si hay error de dirección activo
const hasAddressError = computed(() => !!(calculationError.value && addressWithError.value))

// Función para hacer scroll al componente y mostrar animación
const scrollToCardWithAnimation = () => {
  const element = contactCardRef.value
  if (element?.scrollIntoView) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    showBorderAnimation.value = true
    setTimeout(() => {
      showBorderAnimation.value = false
    }, 2000)
  }
}

const handleAddressSelection = async (address: Address) => {
  // Limpiar errores previos
  addressWithError.value = null
  orderStore.setSelectedAddress(address)

  if (!address.id) return

  orderStore.setCalculatingDelivery(true)
  const result = await recalculateOnAddressChange(address.id)
  orderStore.setCalculatingDelivery(false)

  if (!result && calculationError.value) {
    addressWithError.value = address.id
    orderStore.clearSelectedAddress()
  }
}

const dismissAddressError = () => {
  addressWithError.value = null
}

// Sincronizar direcciones cargadas con el orderStore
watch(addresses, (newAddresses) => {
  if (newAddresses.length > 0) {
    orderStore.setAddressList(newAddresses)
  }
}, { immediate: true })

// Exponer la función para uso externo
defineExpose({ scrollToCardWithAnimation })

onMounted(() => {
  if (userPhone.value && !orderStore.phone) {
    orderStore.setPhone(userPhone.value)
  }
  loadAddresses()
})
</script>

<template>
  <section
    ref="contactCardRef"
    class="transition-all duration-300 scroll-mt-24"
    :class="{ 'highlight-animation': showBorderAnimation }"
  >
    <div class="flex items-center gap-2 mb-4 px-1">
      <h3 class="text-[12px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <Icon name="lucide:user" size="14" />
        Contacto
      </h3>
    </div>

    <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/60 space-y-6">
      
      <!-- Phone Section -->
      <UIPhoneInput :phone="currentPhone" readonly disabled />

      <!-- Divider -->
      <div class="h-px bg-gray-50 w-full"></div>

      <!-- Address Section -->
      <div class="space-y-4">
        <label class="text-[13px] font-bold text-gray-500 flex items-center gap-2">
          <Icon name="lucide:map-pin" size="14" />
          Dirección de entrega
        </label>

        <!-- Loading state -->
        <div v-if="isLoading" class="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-[#001954]" />
          </div>
          <span class="text-[13px] font-medium text-gray-500">Cargando direcciones...</span>
        </div>

        <!-- Empty state -->
        <AdressEmpty v-else-if="orderStore.addressList.length === 0" />

        <!-- Addresses list -->
        <div v-else class="space-y-4">
          
          <!-- Hint Banner (Only show if no address selected) -->
          <div v-if="!orderStore.selectedAddress?.id" class="flex items-start gap-3 bg-blue-50/50 rounded-xl p-3.5 border border-blue-100/50">
            <Icon name="lucide:info" size="16" class="text-blue-500 mt-0.5" />
            <p class="text-[12px] text-blue-600 leading-relaxed font-medium">
              Selecciona donde quieres recibir tu pedido.
            </p>
          </div>

          <!-- Horizontal address list -->
          <AdressSelector
            :addresses="orderStore.addressList"
            :selected-address-id="orderStore.selectedAddress?.id"
            :is-calculating="isCalculating"
            @select-address="handleAddressSelection"
          />

          <!-- Selected indicator with transition -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
          >
            <div v-if="orderStore.selectedAddress?.id">
               <OrderSelectedAddressIndicator :address="orderStore.selectedAddress" />
            </div>
          </Transition>

          <!-- Error message -->
          <AdressErrorMessage :visible="hasAddressError" @dismiss="dismissAddressError" />
        </div>

        <!-- Price Calculation Indicator -->
        <OrderCalculatingIndicator v-if="isCalculating" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.highlight-animation {
  border-radius: 24px;
  animation: pulse-highlight 2s ease-in-out;
}

@keyframes pulse-highlight {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(0, 25, 84, 0);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(0, 25, 84, 0.1), 0 10px 30px rgba(0, 25, 84, 0.15);
    transform: scale(1.01);
  }
}
</style>
