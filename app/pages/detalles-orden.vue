<template>
  <main class="p-2 space-y-4">
    <UINavbar title="Enviar pedido" to="/" />
    <OrderContactCard />
    <OrderPaymentCard />
    <OrderProductList />
    <OrderDetailsCard />
    <UIButtonAction label="Ordenar" class-name="w-full" />
  </main>
</template>

<script setup lang="ts">
const orderStore = useOrderStore()

onMounted(() => {
  orderStore.initializeDefaults()
})
</script>

<style scoped></style>