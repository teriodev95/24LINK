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

// Función para hacer scroll al componente y mostrar animación
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
  console.log('📍 Dirección seleccionada:', address)

  // Limpiar error anterior
  addressWithError.value = null

  orderStore.setSelectedAddress(address)

  if (address.id) {
    const result = await recalculateOnAddressChange(address.id)

    // Si hubo error, marcar la dirección como problemática y limpiar selección
    if (!result && calculationError.value) {
      addressWithError.value = address.id
      orderStore.clearSelectedAddress()
      console.error('❌ No se pudo calcular el envío para esta dirección')
    }
  }
}

// Sincronizar direcciones cargadas con el orderStore
watch(addresses, (newAddresses) => {
  console.log('🔄 Direcciones actualizadas:', newAddresses.length)
  if (newAddresses.length > 0) {
    orderStore.setAddressList(newAddresses)
  }
}, { immediate: true })

// Exponer la función para uso externo
defineExpose({ scrollToCardWithAnimation })

onMounted(() => {
  console.log('🚀 ContactCard montado, cargando direcciones...')
  if (userPhone.value && !orderStore.phone) {
    orderStore.setPhone(userPhone.value)
  }

  loadAddresses()
  console.log('📦 Direcciones en store:', orderStore.addressList)
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

      <!-- Empty state - cuando no hay direcciones -->
      <div v-if="orderStore.addressList.length === 0" class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-xl p-6">
        <div class="flex flex-col items-center text-center space-y-3">
          <!-- Icono de ubicación -->
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
            <LucideMapPin :size="32" class="text-[#001954]" />
          </div>

          <!-- Título -->
          <div>
            <h4 class="text-[#001954] font-semibold text-base mb-1">
              Necesitamos tu dirección de entrega
            </h4>
            <p class="text-gray-600 text-sm leading-relaxed">
              Agrega una dirección para calcular el costo de envío y completar tu pedido
            </p>
          </div>

          <!-- Botón de acción -->
          <NuxtLink to="/ubicacion"
            class="inline-flex items-center gap-2 bg-[#001954] text-white px-6 py-3 rounded-lg hover:bg-[#003d99] transition-colors duration-200 font-medium shadow-md hover:shadow-lg">
            <LucidePlus :size="18" />
            <span>Agregar dirección de entrega</span>
          </NuxtLink>

          <!-- Nota adicional -->
          <p class="text-xs text-gray-500 mt-2">
            Podrás guardar múltiples direcciones para tus próximas compras
          </p>
        </div>
      </div>

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
        <div class="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
          <!-- Botón agregar nueva dirección -->
          <NuxtLink to="/ubicacion"
            class="flex-shrink-0 w-32 h-24 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-[#001954] hover:bg-gray-50 transition-all duration-200 flex flex-col items-center justify-center gap-2 group">
            <div class="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#001954] transition-colors flex items-center justify-center">
              <LucidePlus :size="20" class="text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <span class="text-xs text-gray-600 group-hover:text-[#001954] font-medium transition-colors">
              Nueva dirección
            </span>
          </NuxtLink>

          <!-- Direcciones guardadas -->
          <UISelectionButton v-for="address in orderStore.addressList" :key="address.id"
            :item="{ title: address.street, description: address.colony }"
            :is-selected="orderStore.selectedAddress?.id === address.id"
            custom-class="flex-shrink-0 min-w-[160px] max-w-[240px]"
            :disabled="isCalculating"
            @select="handleAddressSelection(address)" />
        </div>

        <!-- Indicador de dirección seleccionada -->
        <div v-if="orderStore.selectedAddress" class="flex items-start gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <LucideCheckCircle2 :size="16" class="text-green-600 flex-shrink-0 mt-0.5" />
          <p class="text-green-800 text-xs font-medium line-clamp-2 flex-1">
            Dirección seleccionada: {{ orderStore.selectedAddress.street }}, {{ orderStore.selectedAddress.colony }}
          </p>
        </div>

        <!-- Error de cálculo de envío -->
        <div v-if="calculationError && addressWithError" class="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <LucideAlertTriangle :size="20" class="text-red-600" />
            </div>
            <div class="flex-1">
              <h4 class="text-red-900 font-semibold text-sm mb-1">
                No podemos calcular el envío a esta dirección
              </h4>
              <p class="text-red-700 text-xs leading-relaxed mb-3">
                La dirección seleccionada no tiene coordenadas válidas o está fuera de nuestra área de cobertura. Por favor, selecciona otra dirección o agrega una nueva con la ubicación correcta.
              </p>
              <div class="flex items-center gap-2">
                <button
                  @click="addressWithError = null"
                  class="text-xs text-red-700 hover:text-red-900 font-medium underline transition-colors"
                >
                  Entendido, seleccionaré otra dirección
                </button>
              </div>
            </div>
          </div>
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

/* Ocultar scrollbar pero mantener funcionalidad */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>