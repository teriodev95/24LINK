<script setup lang="ts">
const router = useRouter()
const { isAuthenticated } = useAuth()

const showPinStep = ref(false)

// Si ya hay sesión activa, redirigir a detalles de orden
onMounted(() => {
  if (isAuthenticated.value) {
    console.log('✅ Usuario ya autenticado, redirigiendo...')
    router.push('/detalles-orden')
  }
})

function handlePhoneVerified(success: boolean) {
  if (success) {
    showPinStep.value = true
  }
}

function handlePinVerified(success: boolean) {
  if (success) {
    router.push('/detalles-orden')
  }
}

function handleSendPin() {
  showPinStep.value = true
}

useSeoMeta({
  title: "Verificación - 24 Horas de Fiesta | Acceso Seguro",
  description: "Verifica tu número telefónico para acceder a tu cuenta y realizar pedidos de bebidas y botanas a domicilio 24/7. Proceso rápido y seguro.",
  keywords: "verificación teléfono, login 24 horas fiesta, acceso cuenta, verificar número, delivery bebidas",
  author: "24 Horas de Fiesta",

  // Open Graph
  ogTitle: "Verificación - 24 Horas de Fiesta",
  ogDescription: "Verifica tu número telefónico para acceder a nuestro servicio de entrega 24/7 de bebidas y botanas.",
  ogType: "website",
  ogUrl: "https://24link.pages.dev/verificacion",
  ogImage: "./images/icono-24link.png",
  ogSiteName: "24 Horas de Fiesta",

  // Twitter Card
  twitterCard: "summary_large_image",
  twitterTitle: "Verificación - 24 Horas de Fiesta",
  twitterDescription: "Verifica tu número telefónico para acceder a nuestro servicio de entrega 24/7.",
  twitterImage: "./images/icono-24link.png",

  // Structured data hints for search engines
  robots: "noindex, follow",
  viewport: "width=device-width, initial-scale=1",
});
</script>

<template>
  <main class="p-2 space-y-8">
    <UINavbar title="Verificación" to="/" />

    <VerificationForm v-if="!showPinStep" type="phone" @verified="handlePhoneVerified" @send-pin="handleSendPin" />

    <VerificationForm v-if="showPinStep" type="pin" @verified="handlePinVerified" />
  </main>
</template>