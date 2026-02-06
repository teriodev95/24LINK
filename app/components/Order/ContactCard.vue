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
    class="transition-all duration-200"
    :class="{ 'highlight-animation': showBorderAnimation }"
  >
    <p class="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Contacto</p>

    <div class="space-y-3">
      <UIPhoneInput :phone="currentPhone" readonly disabled />

      <div class="space-y-2.5">
        <p class="text-[13px] font-medium text-gray-500 px-1">Dirección de entrega</p>

        <!-- Loading state -->
        <div v-if="isLoading" class="flex items-center gap-3 bg-gray-50/80 rounded-2xl p-3.5">
          <div class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-[#001954]" />
          </div>
          <span class="text-[13px] text-gray-500">Cargando direcciones...</span>
        </div>

        <!-- Empty state -->
        <AdressEmpty v-else-if="orderStore.addressList.length === 0" />

        <!-- Addresses list -->
        <div v-else class="space-y-2.5">
          <!-- Info hint -->
          <div class="flex items-center gap-3 bg-blue-50 rounded-2xl p-3.5">
            <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Icon name="lucide:info" size="18" class="text-blue-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-semibold text-blue-800 leading-tight">
                {{ orderStore.selectedAddress ? 'Dirección seleccionada' : 'Selecciona una dirección' }}
              </p>
              <p class="text-[11px] text-blue-600 mt-0.5">
                {{ orderStore.selectedAddress
                  ? 'Enviaremos tu pedido a esta dirección'
                  : 'Toca sobre una dirección para seleccionarla' }}
              </p>
            </div>
          </div>

          <!-- Horizontal address list -->
          <AdressSelector
            :addresses="orderStore.addressList"
            :selected-address-id="orderStore.selectedAddress?.id"
            :is-calculating="isCalculating"
            @select-address="handleAddressSelection"
          />

          <!-- Selected address indicator -->
          <OrderSelectedAddressIndicator
            v-if="orderStore.selectedAddress?.id"
            :address="orderStore.selectedAddress"
          />

          <!-- Error message -->
          <AdressErrorMessage :visible="hasAddressError" @dismiss="dismissAddressError" />
        </div>

        <!-- Calculating indicator -->
        <OrderCalculatingIndicator v-if="isCalculating" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.highlight-animation {
  border-radius: 16px;
  box-shadow: 0 0 0 2px #001954, 0 0 20px rgba(0, 25, 84, 0.3);
  animation: pulse-highlight 2s ease-in-out;
}

@keyframes pulse-highlight {
  0%, 100% {
    box-shadow: 0 0 0 2px #001954, 0 0 20px rgba(0, 25, 84, 0.3);
  }
  50% {
    box-shadow: 0 0 0 2px #003d99, 0 0 30px rgba(0, 25, 84, 0.5);
  }
}
</style>
