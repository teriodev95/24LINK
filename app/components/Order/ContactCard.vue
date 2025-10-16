<script setup lang="ts">
import type { Address } from '~/interfaces'

const { addresses, isLoading, loadAddresses } = useAddresses()
const { recalculateOnAddressChange, isCalculating } = useDeliveryCalculator()
const { userPhone } = useAuth()
const orderStore = useOrderStore()

const contactCardRef = ref<HTMLElement>()
const showBorderAnimation = ref(false)

const scrollToCardWithAnimation = () => {
  if (contactCardRef.value) {
    // Acceder al elemento DOM del componente usando $el
    const element = contactCardRef.value.$el || contactCardRef.value
    if (element && element.scrollIntoView) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      showBorderAnimation.value = true
      setTimeout(() => {
        showBorderAnimation.value = false
      }, 2000)
    }
  }
}

const handleAddressSelection = async (address: Address) => {
  orderStore.setSelectedAddress(address)

  if (address.id) await recalculateOnAddressChange(address.id)
}

watch(addresses, (newAddresses) => {
  if (newAddresses.length > 0) orderStore.setAddressList(newAddresses)
}, { immediate: true })

defineExpose({ scrollToCardWithAnimation })

onMounted(async () => {
  if (userPhone.value && !orderStore.phone) orderStore.setPhone(userPhone.value)
  await loadAddresses()
})
</script>

<template>
  <UISection ref="contactCardRef" title="Datos del Contacto" :class="{ 'border-error-animation': showBorderAnimation }"
    class="transition-all duration-200">
    <div class="space-y-2">
      <label for="phone" class="text-secondary">Télefono Celular 📱</label>
      <div class="relative">
        <input id="phone" type="tel" :value="userPhone || orderStore.phone" readonly disabled
          class="w-full p-2 border border-gray-300 rounded py-4 px-[18px] bg-gray-100 text-gray-700 cursor-not-allowed">
        <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
          <LucideLock :size="16" class="text-gray-400" />
        </div>
      </div>
      <p class="text-xs text-gray-500">Este es el teléfono con el que iniciaste sesión</p>
    </div>

    <div class="space-y-2">
      <h3 class="text-secondary">Dirección de entrega 🚚</h3>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex items-center justify-center p-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#001954]" />
        <span class="ml-2 text-gray-500">Cargando direcciones...</span>
      </div>

      <!-- Addresses list -->
      <div v-else class="flex overflow-scroll gap-2 p-2">
        <NuxtLink to="/ubicacion"
          class="rounded-lg w-14 h-14 p-2 drop-shadow-lg bg-white flex-shrink-0 flex justify-center items-center">
          <LucidePlus class="m-auto" />
        </NuxtLink>

        <UISelectionButton v-for="address in orderStore.addressList" :key="address.id"
          :item="{ title: address.street, description: address.colony }"
          :is-selected="orderStore.selectedAddress?.id === address.id" custom-class="whitespace-nowrap h-14"
          :disabled="isCalculating" @select="handleAddressSelection(address)" />

        <!-- Empty state -->
        <div v-if="orderStore.addressList.length === 0" class="text-gray-500 text-sm p-2">
          No tienes direcciones guardadas. Agrega una nueva.
        </div>
      </div>

      <!-- Calculating indicator -->
      <div v-if="isCalculating" class="flex items-center gap-2 p-2 text-sm text-gray-600">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#001954]" />
        <span>Calculando costo de envío...</span>
      </div>
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