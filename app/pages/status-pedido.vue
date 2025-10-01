<script setup lang="ts">
import { mockOrder } from '~/constants';
</script>

<template>
  <main class="p-2 space-y-4">
    <UINavbar title="Seguimiento de tu pedido" to="/detalles-orden" />

    <OrderProductList :products="mockOrder.productos" />
    <OrderDetailsCard show-payment-method />
  </main>
</template>
