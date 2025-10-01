<script setup lang="ts">

</script>

<template>
  <main class="p-2 space-y-4">
    <UINavbar title="Seguimiento de tu pedido" to="/detalles-orden" />


    <OrderProductList />
    <OrderDetailsCard show-payment-method />
  </main>
</template>
