<script setup lang="ts">
const router = useRouter()
const orderStore = useOrderStore()
const cartStore = useCartStore()
const { createOrder, isLoading } = useOrderApi()
orderStore.initializeDefaults()

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

useSeoMeta({
  title: "Detalles del Pedido - 24 Horas de Fiesta | Confirmar Orden",
  description: "Revisa y confirma tu pedido de bebidas y botanas antes de realizar la orden. Verifica dirección, productos y método de pago.",
  keywords: "confirmar pedido, detalles orden, carrito compras, 24 horas fiesta, bebidas domicilio, checkout",
  author: "24 Horas de Fiesta",

  // Open Graph
  ogTitle: "Detalles del Pedido - 24 Horas de Fiesta",
  ogDescription: "Revisa y confirma tu pedido de bebidas y botanas antes de realizar la orden. Servicio 24/7.",
  ogType: "website",
  ogUrl: "https://24link.pages.dev/detalles-orden",
  ogImage: "./images/icono-24link.png",
  ogSiteName: "24 Horas de Fiesta",

  // Twitter Card
  twitterCard: "summary_large_image",
  twitterTitle: "Detalles del Pedido - 24 Horas de Fiesta",
  twitterDescription: "Revisa y confirma tu pedido de bebidas y botanas antes de realizar la orden.",
  twitterImage: "./images/icono-24link.png",

  // Structured data hints for search engines
  robots: "noindex, follow",
  viewport: "width=device-width, initial-scale=1",
});
</script>

<template>
  <main class="p-2 space-y-4">
    <UINavbar title="Enviar pedido" to="/" />

    <!-- Mensaje de alerta cuando no hay dirección -->
    <div v-if="!orderStore.selectedAddress" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <LucideAlertCircle :size="20" class="text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p class="text-primary font-semibold text-sm">
            Necesitas agregar una dirección de entrega
          </p>
          <p class="text-secondary text-sm mt-1">
            Agrega tu dirección en la sección de contacto para poder realizar tu pedido
          </p>
        </div>
      </div>
    </div>

    <OrderContactCard />
    <OrderPaymentCard />
    <ClientOnly>
      <OrderProductList :products="cartStore.cartItems" />
      <OrderDetailsCard />
    </ClientOnly>
    <UIButtonAction label="Ordenar" class-name="w-full" :disabled="!orderStore.canPlaceOrder || isLoading"
      :loading="isLoading" @click="handleCreateOrder" />
  </main>
</template>
