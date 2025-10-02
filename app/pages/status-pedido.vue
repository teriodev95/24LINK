<script setup lang="ts">
import { mockOrder } from '~/constants';
</script>

<template>
  <main class="p-2 space-y-4">
    <UINavbar title="Seguimiento de tu pedido" to="/" />

    <OrderStatusStepper :current-status="mockOrder.estado" />

    <OrderProductList :products="mockOrder.productos" />

    <ClientOnly>
      <OrderDetailsCard show-payment-method />x
    </ClientOnly>
  </main>
</template>
