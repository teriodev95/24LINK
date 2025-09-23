<script setup lang="ts">
interface PaymentMethod {
  type: string
  title: string
  description: string

}

interface DeliveryMethod {
  type: string
  title: string
}

const paymentMethods: PaymentMethod[] = [
  { type: 'card', title: 'Tarjeta', description: 'Solicita la terminal' },
  { type: 'cash', title: 'Efectivo', description: 'Paga con efectivo' },
  { type: 'mixed', title: 'Mixto', description: 'Pago mixto (tarjeta y efectivo)' }
]
const deliveryMethods: DeliveryMethod[] = [
  { type: 'outside', title: 'Encontrarse afuera' },
  { type: 'inside', title: 'Entregar en la puerta' }
]
const selectedPaymentMethod = ref<PaymentMethod>(paymentMethods[0] || { type: '', title: '', description: '' })
const selectedDeliveryMethod = ref<DeliveryMethod>(deliveryMethods[0] || { type: '', title: '' })

</script>

<template>
  <UIFormSection title="Pago y entrega">
    <div class="space-y-2">
      <h3 class="text-sm font-normal text-[#001954]">Método de pago 💰</h3>

      <div class="flex overflow-scroll space-x-2">
        <UISelectionButton v-for="method in paymentMethods" :key="method.type" :item="method"
          :is-selected="selectedPaymentMethod?.type === method.type" custom-class="whitespace-nowrap"
          @select="selectedPaymentMethod = method" />
      </div>
    </div>

    <div class="space-y-2">
      <h3 class="text-sm font-normal text-[#001954]">Método de entrega 🚚</h3>

      <div class="flex gap-x-2">
        <UISelectionButton v-for="method in deliveryMethods" :key="method.type" :item="method"
          :is-selected="selectedDeliveryMethod?.type === method.type" @select="selectedDeliveryMethod = method" />
      </div>
    </div>
  </UIFormSection>
</template>