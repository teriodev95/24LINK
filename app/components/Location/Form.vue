<script setup lang="ts">
import { ref } from 'vue'
const { $toast } = useNuxtApp()

interface Emits {
  (e: 'action:location-selection'): void
}

defineEmits<Emits>()

const orderStore = useOrderStore()
const router = useRouter()
const { saveAddress, isSaving } = useAddresses()

const address = ref('')
const phone = ref('')
const reference = ref('')

const submitForm = async () => {
  // Validar campos
  if (!address.value.trim()) {
    $toast.error('La dirección es requerida')
    return
  }

  if (!phone.value.trim()) {
    $toast.error('El número es requerido')
    return
  }

  // Obtener coordenadas de la ubicación seleccionada
  const deliveryLocation = orderStore.deliveryLocation

  if (!deliveryLocation) {
    $toast.error('No se ha seleccionado una ubicación en el mapa')
    return
  }

  // Guardar dirección en la BD
  const result = await saveAddress({
    calle: address.value,
    numero_exterior: phone.value,
    colonia: reference.value || 'Sin referencia',
    referencias: reference.value,
    latitud: deliveryLocation.lat,
    longitud: deliveryLocation.lng
  })

  if (result.success) {
    $toast.success('Dirección guardada correctamente')
    router.push({ name: 'detalles-orden' })
  } else {
    $toast.error(result.error || 'Error al guardar la dirección')
  }
}
</script>

<template>
  <form class="absolute left-4 right-4 bottom-4 p-4 bg-white border border-[#E6E6E6] space-y-4 rounded-lg"
    @submit.prevent="submitForm">
    <h2 class="text-primary">
      Datos para la entrega
    </h2>


    <div class="space-y-2">
      <UIFormInput id="address" v-model="address" :disabled="isSaving" label="Dirección"
        placeholder="Dirección de entrega" />
      <UIFormInput id="phone" v-model="phone" :disabled="isSaving" label="Num #" placeholder="#" />
      <UIFormInput id="reference" v-model="reference" :disabled="isSaving" label="Referencia"
        secondary-label="Agrega datos de ayuda que le permitan a nuestro repartidor entregar tu pedido más rapido*"
        placeholder="Referencia" />
    </div>

    <UIButtonAction type="submit" label="Aceptar" :disabled="isSaving" :loading="isSaving" class-name="w-full" />
    <UIButtonAction variant="secondary" label="Volver a seleccionar" :disabled="isSaving" class-name="w-full"
      @click="$emit('action:location-selection')" />
  </form>
</template>