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
</script>

<template>
  <main class="p-2 space-y-8">
    <UINavbar title="Verificación" to="/" />

    <VerificationForm v-if="!showPinStep" type="phone" @verified="handlePhoneVerified" @send-pin="handleSendPin" />

    <VerificationForm v-if="showPinStep" type="pin" @verified="handlePinVerified" />
  </main>
</template>