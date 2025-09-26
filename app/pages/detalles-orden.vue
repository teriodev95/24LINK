<template>
  <main class="p-2 space-y-4">
    <UINavbar title="Volver" to="/" />
    <OrderContactCard />
    <OrderPaymentCard />
    <OrderProductList />
    <OrderDetailsCard />
    <UIButtonAction label="Ordenar" type="button" class-name="w-full" />
  </main>
</template>

<script setup lang="ts">
</script>

<style scoped></style>