<script setup lang="ts">
import type { Address } from '~/interfaces'

const orderStore = useOrderStore()
const { addresses, isLoading, loadAddresses } = useAddresses()
const { recalculateOnAddressChange, isCalculating } = useDeliveryCalculator()
const { userPhone } = useAuth()
const route = useRoute()

// Cargar direcciones del usuario al montar el componente
onMounted(() => {
  console.log('📍 ContactCard: Montado, cargando direcciones...')

  // Establecer el teléfono del usuario en sesión
  if (userPhone.value && !orderStore.phone) {
    orderStore.setPhone(userPhone.value)
    console.log('📱 Teléfono establecido desde sesión:', userPhone.value)
  }

  loadAddresses()
})

// Recargar direcciones cuando el usuario vuelve a esta página
watch(() => route.path, (newPath) => {
  if (newPath === '/detalles-orden') {
    console.log('🔄 ContactCard: Recargando direcciones porque volvió a detalles-orden')
    loadAddresses()
  }
})

// Sincronizar direcciones cargadas con el orderStore
watch(addresses, (newAddresses) => {
  if (newAddresses.length > 0) {
    orderStore.setAddressList(newAddresses)
    // Si no hay dirección seleccionada, seleccionar la primera y calcular costo
    if (!orderStore.selectedAddress) {
      handleAddressSelection(newAddresses[0]!)
    }
    console.log('✅ ContactCard: Direcciones sincronizadas:', newAddresses.length)
  }
}, { immediate: true })

// Manejar selección de dirección y recalcular costo
const handleAddressSelection = async (address: Address) => {
  console.log('📍 Dirección seleccionada:', address)

  // Actualizar dirección seleccionada
  orderStore.setSelectedAddress(address)

  // Recalcular costo de envío basado en coordenadas de la dirección
  if (address.id) {
    await recalculateOnAddressChange(address.id)
  }
}
</script>

<template>
  <UISection title="Datos del Contacto">
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