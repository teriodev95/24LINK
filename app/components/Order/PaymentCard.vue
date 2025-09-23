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
  <section class="p-4 border space-y-4 rounded-lg">
    <h2 class="text-[#001954] font-bold">Pago y entrega</h2>

    <div class="space-y-2">
      <h3 for="name" class="text-sm font-normal text-[#001954]">Método de pago 💰</h3>

      <div class="flex overflow-scroll space-x-2">
        <button v-for="method in paymentMethods" :key="method.type"
          class="p-2 text-left rounded-lg space-y-1 whitespace-nowrap border drop-shadow-lg"
          :class="[selectedPaymentMethod?.type === method.type ? 'bg-[#CCD1DD]' : 'bg-white']"
          @click="selectedPaymentMethod = method">
          <p class="text-sm font-bold text-[#001954]">{{ method.title }}</p>
          <p class="text-xs font-normal text-[#001954]">{{ method.description }}</p>
        </button>
      </div>
    </div>

    <div class="space-y-2">
      <h3 class="text-sm font-normal text-[#001954]">Método de entrega 🚚</h3>

      <div class="flex gap-x-2">
        <button v-for="method in deliveryMethods" :key="method.type"
          class="p-2 rounded-lg space-y-1 border drop-shadow-lg"
          :class="[selectedDeliveryMethod?.type === method.type ? 'bg-[#CCD1DD]' : 'bg-white']"
          @click="selectedDeliveryMethod = method">
          <p class="text-sm font-bold text-[#001954]">{{ method.title }}</p>
        </button>
      </div>
    </div>
  </section>
</template>