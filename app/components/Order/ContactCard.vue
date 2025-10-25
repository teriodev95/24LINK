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
  const element = contactCardRef.value?.$el || contactCardRef.value
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

  const result = await recalculateOnAddressChange(address.id)

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
  <UISection ref="contactCardRef" title="Datos del Contacto" :class="{ 'border-error-animation': showBorderAnimation }"
    class="transition-all duration-200">
    <UIPhoneInput :phone="currentPhone" readonly disabled />

    <div class="space-y-2">
      <h3 class="text-secondary">Dirección de entrega 🚚</h3>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex items-center justify-center p-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#001954]" />
        <span class="ml-2 text-gray-500">Cargando direcciones...</span>
      </div>

      <!-- Empty state - cuando no hay direcciones -->
      <OrderEmptyAddressState v-if="orderStore.addressList.length === 0" />

      <!-- Addresses list - cuando hay direcciones -->
      <div v-else class="space-y-3">
        <!-- Instrucción para el usuario -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <div class="flex items-start gap-2">
            <LucideInfo :size="18" class="text-[#001954] flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-[#001954] font-medium text-sm">
                Selecciona tu dirección de entrega
              </p>
              <p class="text-gray-600 text-xs mt-0.5">
                {{ orderStore.selectedAddress
                  ? 'Enviaremos tu pedido a la dirección seleccionada'
                  : 'Toca sobre una dirección para seleccionarla' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Lista de direcciones horizontal -->
        <OrderAddressSelector
          :addresses="orderStore.addressList"
          :selected-address-id="orderStore.selectedAddress?.id"
          :is-calculating="isCalculating"
          @select-address="handleAddressSelection" />

        <!-- Indicador de dirección seleccionada -->
        <OrderSelectedAddressIndicator
          v-if="orderStore.selectedAddress"
          :address="orderStore.selectedAddress" />

        <!-- Error de cálculo de envío -->
        <OrderAddressErrorMessage :visible="hasAddressError" @dismiss="dismissAddressError" />
      </div>

      <!-- Calculating indicator -->
      <OrderCalculatingIndicator v-if="isCalculating" />
    </div>
  </UISection>
</template>

<style scoped>
.border-error-animation {
  border: 2px solid #001954;
  box-shadow: 0 0 10px rgba(0, 25, 84, 0.5);
  animation: pulse-border 2s ease-in-out;
}

@keyframes pulse-border {

  0%,
  100% {
    border-color: #001954;
    box-shadow: 0 0 10px rgba(0, 25, 84, 0.5);
  }

  50% {
    border-color: #003d99;
    box-shadow: 0 0 20px rgba(0, 25, 84, 0.8);
  }
}

</style>