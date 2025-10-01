<script setup lang="ts">
const orderStore = useOrderStore()
</script>

<template>
  <UIFormSection title="Datos del Contacto">
    <form action="" class="space-y-2">
      <label for="phone" class="text-secondary">Télefono Celular 📱</label>
      <input id="phone" type="tel" placeholder="Telefono" :value="orderStore.phone"
        class="w-full p-2 border border-gray-300 rounded py-4 px-[18px]"
        @input="orderStore.setPhone($event.target.value)">
    </form>

    <div class="space-y-2">
      <h3 class="text-secondary">Dirección de entrega 🚚</h3>

      <div class="flex overflow-scroll gap-2 p-2">
        <NuxtLink to="/ubicacion" class="rounded-lg w-14 h-14 p-2 drop-shadow-lg bg-white flex-shrink-0">
          <LucidePlus class="m-auto" />
        </NuxtLink>

        <UISelectionButton v-for="address in orderStore.addressList" :key="address.id"
          :item="{ title: address.street, description: address.colony }"
          :is-selected="orderStore.selectedAddress?.id === address.id" custom-class="whitespace-nowrap h-14"
          @select="orderStore.setSelectedAddress(address)" />
      </div>
    </div>
  </UIFormSection>
</template>