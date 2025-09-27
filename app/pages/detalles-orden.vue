<script setup lang="ts">
const orderStore = useOrderStore()

onMounted(() => {
  orderStore.initializeDefaults()
})
</script>

<template>
  <main class="p-2 space-y-4">
    <UINavbar title="Enviar pedido" to="/" />
    <OrderContactCard />
    <OrderPaymentCard />
    <ClientOnly>
      <OrderProductList />
      <OrderDetailsCard />
    </ClientOnly>
    <UIButtonAction role="link" label="Ordenar" to="/verificacion" class-name="w-full"
      :disabled="!orderStore.canPlaceOrder" />
  </main>
</template>
