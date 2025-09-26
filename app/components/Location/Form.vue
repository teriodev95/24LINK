<script setup lang="ts">
import { ref } from 'vue'
const toast = useToast()

interface Emits {
  (e: 'action:location-selection'): void
}

defineEmits<Emits>()

const orderStore = useOrderStore()
const router = useRouter()

const address = ref('')
const phone = ref('')
const reference = ref('')
const isSubmitting = ref(false)


const submitForm = async () => {
  orderStore.addNewAddress(`${address.value}, ${phone.value}`, reference.value)
  isSubmitting.value = true
  await new Promise((resolve) => setTimeout(resolve, 3000))
  isSubmitting.value = false
  toast.success({
    title: 'Exito',
    message: 'Dirección guardada correctamente',
  })

  router.push({ name: 'detalles-orden' })

}
</script>

<template>
  <form class="absolute left-4 right-4 bottom-4 p-4 bg-white border border-[#E6E6E6] space-y-4 rounded-lg"
    @submit.prevent="submitForm">
    <h2 class="text-primary">
      Datos para la entrega
    </h2>


    <div class="space-y-2">
      <UIFormInput id="address" v-model="address" :disabled="isSubmitting" label="Dirección"
        placeholder="Dirección de entrega" />
      <UIFormInput id="phone" v-model="phone" :disabled="isSubmitting" label="Num #" placeholder="#" />
      <UIFormInput id="reference" v-model="reference" :disabled="isSubmitting" label="Referencia"
        secondary-label="Agrega datos de ayuda que le permitan a nuestro repartidor entregar tu pedido más rapido*"
        placeholder="Referencia" />
    </div>

    <UIButtonAction type="submit" label="Aceptar" :disabled="isSubmitting" class-name="w-full" />
    <UIButtonAction variant="secondary" label="Volver a seleccionar" :disabled="isSubmitting" class-name="w-full"
      @click="$emit('action:location-selection')" />
  </form>
</template>