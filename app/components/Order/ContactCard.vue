<script setup lang="ts">
const adressList = [
  {
    id: '1',
    street: 'Av universidad #1050',
    colony: 'Villa universidad'
  },
  {
    id: '2',
    street: 'Av universidad #1050',
    colony: 'Villa universidad'
  },
  {
    id: '3',
    street: 'Av universidad #1050',
    colony: 'Villa universidad'
  },
  {
    id: '4',
    street: 'Av universidad #1050',
    colony: 'Villa universidad'
  }
]

const selectedAddress = ref(adressList[0])
</script>

<template>
  <UIFormSection title="Datos del Contacto">
    <form action="" class="space-y-2">
      <label for="phone" class="text-sm font-normal text-[#001954]">Télefono Celular 📱</label>
      <input id="phone" type="tel" placeholder="Telefono"
        class="w-full p-2 border border-gray-300 rounded py-4 px-[18px]">
    </form>

    <div class="space-y-2">
      <h3 class="text-sm font-normal text-[#001954]">Dirección de entrega 🚚</h3>

      <div class="flex overflow-scroll space-x-2">
        <button class="rounded-lg w-14 h-14 p-2 drop-shadow-lg bg-white flex-shrink-0">
          <LucidePlus class="m-auto" />
        </button>

        <UISelectionButton
          v-for="address in adressList"
          :key="address.id"
          :item="{ title: address.street, description: address.colony }"
          :is-selected="selectedAddress?.id === address.id"
          custom-class="whitespace-nowrap h-14"
          @select="selectedAddress = address"
        />
      </div>
    </div>
  </UIFormSection>
</template>