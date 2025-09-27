<script setup lang="ts">
const router = useRouter()

const showPinStep = ref(false)

function handlePhoneVerified(success: boolean) {
  if (success) {
    showPinStep.value = true
  }
}

function handlePinVerified(success: boolean) {
  if (success) {
    router.push('/')
  }
}

function handleSendPin() {
  showPinStep.value = true
}
</script>

<template>
  <main class="p-2 space-y-8">
    <UINavbar title="Verificación" to="/detalles-orden" />

    <VerificationCard v-if="!showPinStep" type="phone" @verified="handlePhoneVerified" @send-pin="handleSendPin" />

    <VerificationCard v-if="showPinStep" type="pin" @verified="handlePinVerified" />
  </main>
</template>