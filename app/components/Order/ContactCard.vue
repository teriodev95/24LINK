<script setup lang="ts">
import { useContactCard } from '~/composables/useContactCard';

const {
  contactCardRef,
  showBorderAnimation,
  isLoading,
  isCalculating,
  userPhone,
  scrollToCardWithAnimation,
  handleAddressSelection,
  initializeContact,
  orderStore
} = useContactCard()

defineExpose({ scrollToCardWithAnimation })

onMounted(initializeContact)
</script>

<template>
  <UISection ref="contactCardRef" title="Datos del Contacto" :class="{ 'border-error-animation': showBorderAnimation }"
    class="transition-all duration-200">
    <UIPhoneField :model-value="userPhone || orderStore.phone" />

    <OrderAddressSelector :addresses="orderStore.addressList" :selected-address="orderStore.selectedAddress"
      :is-loading="isLoading" :is-calculating="isCalculating" @select="handleAddressSelection" />
  </UISection>
</template>

<style scoped>
.border-error-animation {
  border: 2px solid #001954;
  box-shadow: 0 0 10px rgba(0, 25, 84, 0.5);
  animation: pulse-border 2s ease-in-out;
}

@keyframes pulse-border {

  0%,
  100% {
    border-color: #001954;
    box-shadow: 0 0 10px rgba(0, 25, 84, 0.5);
  }

  50% {
    border-color: #003d99;
    box-shadow: 0 0 20px rgba(0, 25, 84, 0.8);
  }
}
</style>