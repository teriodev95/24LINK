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
  <section>
    <div class="flex items-center gap-2 mb-4 px-1">
      <h3 class="text-[12px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <Icon name="lucide:settings-2" size="14" />
        Opciones de entrega
      </h3>
    </div>

    <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/60 space-y-6">
      <!-- Payment methods -->
      <div class="space-y-3">
        <p class="text-[13px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
           <Icon name="lucide:wallet-2" size="14" />
           Método de pago
        </p>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="method in orderStore.paymentMethods"
            :key="method.type"
            class="group relative flex flex-col items-center justify-center gap-2 h-[88px] rounded-2xl border transition-all duration-200 cursor-pointer active:scale-[0.97]"
            :class="orderStore.selectedPaymentMethod?.type === method.type
              ? 'border-[#001954] bg-[#001954] shadow-lg shadow-[#001954]/20'
              : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200'"
            @click="orderStore.setSelectedPaymentMethod(method)"
          >
            <!-- Selected Check -->
            <div v-if="orderStore.selectedPaymentMethod?.type === method.type" class="absolute top-2 right-2">
               <Icon name="lucide:check-circle-2" size="14" class="text-emerald-400" />
            </div>

            <Icon
              :name="paymentIcons[method.type] || 'lucide:circle'"
              size="24"
              class="transition-colors duration-200"
              :class="orderStore.selectedPaymentMethod?.type === method.type ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'"
            />
            <span
              class="text-[11px] font-bold leading-tight text-center"
              :class="orderStore.selectedPaymentMethod?.type === method.type ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'"
            >
              {{ method.title }}
            </span>
          </button>
        </div>
      </div>

      <!-- Divider -->
      <div class="h-px bg-gray-50 w-full"></div>

      <!-- Delivery methods -->
      <div class="space-y-3">
        <p class="text-[13px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
           <Icon name="lucide:package" size="14" />
           Entrega
        </p>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="method in orderStore.deliveryMethods"
            :key="method.type"
            class="group relative flex items-center gap-3 px-4 h-[64px] rounded-2xl border transition-all duration-200 cursor-pointer active:scale-[0.97]"
            :class="orderStore.selectedDeliveryMethod?.type === method.type
              ? 'border-[#001954] bg-[#001954] shadow-lg shadow-[#001954]/20'
              : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200'"
            @click="orderStore.setSelectedDeliveryMethod(method)"
          >
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              :class="orderStore.selectedDeliveryMethod?.type === method.type ? 'bg-white/10' : 'bg-white border border-gray-100'"
            >
               <Icon
                :name="deliveryIcons[method.type] || 'lucide:truck'"
                size="16"
                :class="orderStore.selectedDeliveryMethod?.type === method.type ? 'text-white' : 'text-gray-400'"
              />
            </div>
            
            <span
              class="text-[12px] font-bold leading-tight"
              :class="orderStore.selectedDeliveryMethod?.type === method.type ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'"
            >
              {{ method.title }}
            </span>

            <!-- Selected Check (Right aligned) -->
            <div v-if="orderStore.selectedDeliveryMethod?.type === method.type" class="ml-auto">
               <Icon name="lucide:check-circle-2" size="16" class="text-emerald-400" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
