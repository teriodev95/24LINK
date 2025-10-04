<script setup lang="ts">
const router = useRouter()
const orderStore = useOrderStore()
const cartStore = useCartStore()
const { createOrder, isCreatingOrder } = useOrderApi()

onMounted(() => {
  orderStore.initializeDefaults()
})

const handleCreateOrder = async () => {
  const result = await createOrder()

  if (result.success) {
    // Redirigir a la página de estado del pedido
    router.push(`/status-pedido?pedido=${result.numeroPedido}`)
  } else {
    // Mostrar error (puedes usar un toast notification)
    console.error('Error al crear el pedido:', result.error)
  }
}
</script>

<template>
  <main class="p-2 space-y-4">
    <UINavbar title="Enviar pedido" to="/" />
    <OrderContactCard />
    <OrderPaymentCard />
    <ClientOnly>
      <OrderProductList :products="cartStore.cartItems" />
      <OrderDetailsCard />
    </ClientOnly>
    <UIButtonAction
      label="Ordenar"
      class-name="w-full"
      :disabled="!orderStore.canPlaceOrder || isCreatingOrder"
      :loading="isCreatingOrder"
      @click="handleCreateOrder"
    />
  </main>
</template>
