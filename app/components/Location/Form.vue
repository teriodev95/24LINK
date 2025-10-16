<script setup lang="ts">
import { ref } from 'vue'
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
const { saveAddress, isSaving } = useAddresses()

const form = ref<IForm>({
  colony: '',
  street: '',
  number: '',
  reference: ''
})

const validateForm = (): boolean => {
  if (!form.value.street.trim()) {
    $toast.error('La dirección es requerida')
    return false
  }

  if (!form.value.number.trim()) {
    $toast.error('El número es requerido')
    return false
  }

  if (!form.value.colony.trim()) {
    $toast.error('La colonia es requerida')
    return false
  }

  return true
}

const submitForm = async () => {
  if (!validateForm()) return

  const deliveryLocation = orderStore.deliveryLocation

  if (!deliveryLocation) {
    $toast.error('No se ha seleccionado una ubicación en el mapa')
    return
  }

  try {
    // Guardar dirección en la BD
    await saveAddress({
      calle: `${form.value.street}`,
      numero_exterior: form.value.number,
      colonia: form.value.colony,
      referencias: form.value.reference,
      latitud: deliveryLocation.lat,
      longitud: deliveryLocation.lng
    })

    $toast.success('Dirección guardada correctamente')
    router.push({ name: 'detalles-orden' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error al guardar la dirección'
    $toast.error(errorMessage)
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
      <UIFormInput id="colony" v-model="form.colony" :disabled="isSaving" label="Colonia" placeholder="Colonia" />
      <UIFormInput id="street" v-model="form.street" :disabled="isSaving" label="Calle" placeholder="Calle" />
      <UIFormInput id="number" v-model="form.number" :disabled="isSaving" type="number" label="Num #" placeholder="#" />
      <UIFormInput id="reference" v-model="form.reference" :disabled="isSaving" label="Referencia" :required="false"
        secondary-label="Agrega datos de ayuda que le permitan a nuestro repartidor entregar tu pedido más rapido*"
        placeholder="Referencia" />
    </div>

    <UIButtonAction type="submit" label="Aceptar" :disabled="isSaving" :loading="isSaving" class-name="w-full" />
    <UIButtonAction variant="secondary" label="Volver a seleccionar" :disabled="isSaving" class-name="w-full"
      @click="$emit('action:location-selection')" />
  </form>
</template>