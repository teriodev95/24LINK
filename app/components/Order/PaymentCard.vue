<script setup lang="ts">
const orderStore = useOrderStore()
</script>

<template>
  <UISection title="Pago y entrega">
    <div class="space-y-2">
      <h3 class="text-secondary">Método de pago 💰</h3>

      <div class="flex overflow-scroll gap-2 p-2">
        <UISelectionButton v-for="method in orderStore.paymentMethods" :key="method.type" :item="method"
          :is-selected="orderStore.selectedPaymentMethod?.type === method.type" custom-class="whitespace-nowrap"
          @select="orderStore.setSelectedPaymentMethod(method)" />
      </div>
    </div>

    <div class="space-y-2">
      <h3 class="text-secondary">Método de entrega 🚚</h3>

      <div class="flex gap-x-2 p-2">
        <UISelectionButton v-for="method in orderStore.deliveryMethods" :key="method.type" :item="method"
          :is-selected="orderStore.selectedDeliveryMethod?.type === method.type"
          @select="orderStore.setSelectedDeliveryMethod(method)" />
      </div>
    </div>
  </UISection>
</template>