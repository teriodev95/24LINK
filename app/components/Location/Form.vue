<script setup lang="ts">
const { $toast } = useNuxtApp()

interface Emits {
  (e: 'action:location-selection'): void
}

interface IForm {
  colony: string
  street: string
  number: string
  reference: string
}

defineEmits<Emits>()

const orderStore = useOrderStore()
const router = useRouter()
const route = useRoute()
const { saveAddress, isSaving } = useAddresses()

const form = ref<IForm>({
  colony: '',
  street: '',
  number: '',
  reference: ''
})

const isFormValid = computed(() =>
  form.value.colony.trim() && form.value.street.trim() && form.value.number.trim()
)

const submitForm = async () => {
  if (!form.value.colony.trim()) {
    $toast.error('La colonia es requerida')
    return
  }
  if (!form.value.street.trim()) {
    $toast.error('La calle es requerida')
    return
  }
  if (!form.value.number.trim()) {
    $toast.error('El número es requerido')
    return
  }

  const deliveryLocation = orderStore.deliveryLocation

  if (!deliveryLocation) {
    $toast.error('No se ha seleccionado una ubicación en el mapa')
    return
  }

  try {
    await saveAddress({
      calle: form.value.street,
      numero_exterior: form.value.number,
      colonia: form.value.colony,
      referencias: form.value.reference,
      latitud: deliveryLocation.lat,
      longitud: deliveryLocation.lng
    })

    $toast.success('Dirección guardada')
    const redirectTo = route.query.from === 'order' ? '/seleccionar-direccion' : '/detalles-orden'
    router.push(redirectTo)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error al guardar la dirección'
    $toast.error(errorMessage)
  }
}
</script>

<template>
  <div class="absolute inset-x-0 bottom-0 z-20">
    <form
      class="bg-white rounded-t-[28px] shadow-2xl shadow-black/20 px-6 pt-5 pb-8 space-y-5"
      @submit.prevent="submitForm"
    >
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-[18px] font-black text-[#001954] leading-tight">Datos de entrega</h2>
          <p class="text-[12px] text-gray-400 font-medium mt-0.5">Completa los datos de tu dirección</p>
        </div>
        <button
          type="button"
          class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 active:bg-gray-200 transition-colors"
          @click="$emit('action:location-selection')"
        >
          <Icon name="lucide:x" size="18" />
        </button>
      </div>

      <!-- Fields grid -->
      <div class="space-y-3">
        <!-- Colonia -->
        <div>
          <label for="colony" class="text-[12px] font-bold text-gray-500 mb-1 block">Colonia</label>
          <input
            id="colony"
            v-model="form.colony"
            type="text"
            placeholder="Ej: Villa Natura"
            :disabled="isSaving"
            class="w-full h-[46px] px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-[#001954] font-medium placeholder:text-gray-300 focus:outline-none focus:border-[#001954] focus:ring-1 focus:ring-[#001954]/10 transition-all disabled:opacity-50"
          />
        </div>

        <!-- Calle + Número en fila -->
        <div class="flex gap-3">
          <div class="flex-1">
            <label for="street" class="text-[12px] font-bold text-gray-500 mb-1 block">Calle</label>
            <input
              id="street"
              v-model="form.street"
              type="text"
              placeholder="Ej: Av. Solidaridad"
              :disabled="isSaving"
              class="w-full h-[46px] px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-[#001954] font-medium placeholder:text-gray-300 focus:outline-none focus:border-[#001954] focus:ring-1 focus:ring-[#001954]/10 transition-all disabled:opacity-50"
            />
          </div>
          <div class="w-[90px] shrink-0">
            <label for="number" class="text-[12px] font-bold text-gray-500 mb-1 block">Núm.</label>
            <input
              id="number"
              v-model="form.number"
              type="text"
              inputmode="numeric"
              placeholder="#"
              :disabled="isSaving"
              class="w-full h-[46px] px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-[#001954] font-medium placeholder:text-gray-300 text-center focus:outline-none focus:border-[#001954] focus:ring-1 focus:ring-[#001954]/10 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <!-- Referencia -->
        <div>
          <label for="reference" class="text-[12px] font-bold text-gray-500 mb-1 block">
            Referencia
            <span class="text-gray-300 font-normal">(opcional)</span>
          </label>
          <input
            id="reference"
            v-model="form.reference"
            type="text"
            placeholder="Ej: Casa blanca, portón negro"
            :disabled="isSaving"
            class="w-full h-[46px] px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-[#001954] font-medium placeholder:text-gray-300 focus:outline-none focus:border-[#001954] focus:ring-1 focus:ring-[#001954]/10 transition-all disabled:opacity-50"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="space-y-2.5 pt-1">
        <button
          type="submit"
          class="w-full h-[50px] rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
          :class="isFormValid && !isSaving
            ? 'bg-[#001954] text-white shadow-lg shadow-[#001954]/25 cursor-pointer'
            : 'bg-gray-100 text-gray-300 cursor-not-allowed'"
          :disabled="!isFormValid || isSaving"
        >
          <template v-if="isSaving">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
            <span>Guardando...</span>
          </template>
          <template v-else>
            <Icon name="lucide:check" size="18" />
            <span>Guardar dirección</span>
          </template>
        </button>

        <button
          type="button"
          class="w-full h-[44px] rounded-2xl font-bold text-[13px] text-gray-400 flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
          :disabled="isSaving"
          @click="$emit('action:location-selection')"
        >
          <Icon name="lucide:map" size="16" />
          <span>Cambiar ubicación en el mapa</span>
        </button>
      </div>
    </form>
  </div>
</template>
