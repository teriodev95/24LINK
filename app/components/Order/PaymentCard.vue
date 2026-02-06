<script setup lang="ts">
const orderStore = useOrderStore()

const paymentIcons: Record<string, string> = {
  card: 'lucide:credit-card',
  cash: 'lucide:banknote',
  mixed: 'lucide:wallet',
}

const deliveryIcons: Record<string, string> = {
  outside: 'lucide:map-pin',
  inside: 'lucide:door-open',
}
</script>

<template>
  <section class="space-y-5">
    <!-- Payment methods -->
    <div>
      <p class="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Método de pago</p>
      <div class="flex gap-2">
        <button
          v-for="method in orderStore.paymentMethods"
          :key="method.type"
          class="flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border-2 transition-all duration-150 cursor-pointer active:scale-[0.97]"
          :class="orderStore.selectedPaymentMethod?.type === method.type
            ? 'border-[#001954] bg-[#001954]/5'
            : 'border-gray-100 bg-white'"
          @click="orderStore.setSelectedPaymentMethod(method)"
        >
          <Icon
            :name="paymentIcons[method.type] || 'lucide:circle'"
            size="22"
            :class="orderStore.selectedPaymentMethod?.type === method.type ? 'text-[#001954]' : 'text-gray-400'"
          />
          <span
            class="text-[12px] font-semibold leading-tight"
            :class="orderStore.selectedPaymentMethod?.type === method.type ? 'text-[#001954]' : 'text-gray-400'"
          >
            {{ method.title }}
          </span>
        </button>
      </div>
    </div>

    <!-- Delivery methods -->
    <div>
      <p class="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Método de entrega</p>
      <div class="flex gap-2">
        <button
          v-for="method in orderStore.deliveryMethods"
          :key="method.type"
          class="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all duration-150 cursor-pointer active:scale-[0.97]"
          :class="orderStore.selectedDeliveryMethod?.type === method.type
            ? 'border-[#001954] bg-[#001954]/5'
            : 'border-gray-100 bg-white'"
          @click="orderStore.setSelectedDeliveryMethod(method)"
        >
          <Icon
            :name="deliveryIcons[method.type] || 'lucide:truck'"
            size="20"
            :class="orderStore.selectedDeliveryMethod?.type === method.type ? 'text-[#001954]' : 'text-gray-400'"
          />
          <span
            class="text-[13px] font-semibold leading-tight"
            :class="orderStore.selectedDeliveryMethod?.type === method.type ? 'text-[#001954]' : 'text-gray-400'"
          >
            {{ method.title }}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>
