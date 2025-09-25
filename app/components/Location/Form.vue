<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'action:location-selection'): void
}

defineEmits<Emits>()

const address = ref('')
const phone = ref('')
const reference = ref('')
</script>

<template>
  <form class="absolute left-4 right-4 bottom-4 p-4 bg-white border border-[#E6E6E6] space-y-4 rounded-lg">
    <h2 class="text-primary">
      Datos para la entrega
    </h2>


    <div class="space-y-2">
      <UIFormInput id="address" v-model="address" label="Dirección" placeholder="Dirección de entrega" />
      <UIFormInput id="phone" v-model="phone" label="Num #" placeholder="#" />
      <UIFormInput id="reference" v-model="reference" label="Referencia" placeholder="Referencia" />
    </div>

    <UIButtonAction type="link" label="Aceptar" class-name="w-full" />
    <UIButtonAction variant="secondary" type="button" label="Volver a seleccionar" class-name="w-full"
      @click="$emit('action:location-selection')" />
  </form>
</template>