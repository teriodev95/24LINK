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
  <section class="p-4 border space-y-4 rounded-lg">
    <h2 class="text-[#001954] font-bold">Datos del Contacto</h2>

    <form action="" class="space-y-2">
      <label for="name" class="text-sm font-normal text-[#001954]">Télefono Celular 📱</label>
      <input id="phone" type="number" placeholder="Telefono"
        class="w-full p-2 border border-gray-300 rounded py-4 px-[18px]">
    </form>

    <div class="space-y-2">
      <h3 class="text-sm font-normal text-[#001954]">Dirección de entrega 🚚</h3>

      <div class="flex overflow-scroll space-x-2">
        <button class="rounded-lg w-14 h-14 p-2 drop-shadow-lg bg-white flex-shrink-0">
          <LucidePlus class="m-auto" />
        </button>

        <button v-for="address in adressList" :key="address.id"
          class="p-2 text-left rounded-lg space-y-1 h-14 whitespace-nowrap border drop-shadow-lg"
          :class="[selectedAddress?.id === address.id ? 'bg-[#CCD1DD]' : 'bg-white']"
          @click="selectedAddress = address">
          <p class="text-sm font-bold text-[#001954]">{{ address.street }}</p>
          <p class="text-sm font-normal text-[#001954]">{{ address.colony }}</p>
        </button>
      </div>
    </div>
  </section>
</template>