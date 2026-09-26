<script setup lang="ts">
interface Emits {
  (e: 'registered'): void
}

const emit = defineEmits<Emits>()

const { isProcessingRequest, validationErrors, phoneNumber, registerWithoutOtp } = useVerification()
const { user } = useAuth()

const name = ref('')
const phone = ref('')
const confirmed = ref(false)

// Auto-fill con datos guardados
onMounted(() => {
  if (user.value?.nombre && user.value.nombre !== 'Cliente') name.value = user.value.nombre
  if (phoneNumber.value) phone.value = phoneNumber.value
})

const canSubmit = computed(() =>
  name.value.trim().length >= 3 && /^\d{10}$/.test(phone.value) && confirmed.value
)

async function handleSubmit() {
  if (!canSubmit.value) return
  const success = await registerWithoutOtp(name.value, phone.value)
  if (success) emit('registered')
}
</script>

<template>
  <div class="space-y-8">
    <div class="text-center space-y-8">
      <div class="flex justify-center">
        <div class="relative bg-[#001954]/10 p-4 rounded-full">
          <LucideUser :size="40" class="text-[#001954]" />
        </div>
      </div>
      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-[#001954]">Tus datos</h1>
        <p class="text-gray-600 text-sm">Los usamos para contactarte sobre tu pedido</p>
      </div>
    </div>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <input v-model="name" type="text" autocomplete="name" placeholder="Nombre completo" maxlength="80"
          class="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-[#001954] focus:outline-none transition-all duration-200"
          :class="{ 'border-red-500': validationErrors.name }">
        <p v-if="validationErrors.name" class="mt-1 text-sm text-red-600">{{ validationErrors.name }}</p>
      </div>

      <VerificationPhoneInput v-model="phone" :error="validationErrors.phone" />

      <label class="flex items-start gap-3 p-1 text-sm text-gray-700 cursor-pointer select-none">
        <input v-model="confirmed" type="checkbox" class="mt-0.5 h-5 w-5 shrink-0 accent-[#001954]">
        <span>Confirmo que mi nombre y número de teléfono son reales y que pueden contactarme para mi pedido.</span>
      </label>

      <VerificationStatusMessage type="phone" :error="validationErrors.phone" />

      <UIButtonAction :label="isProcessingRequest ? 'Guardando...' : 'Continuar'" type="submit"
        class-name="w-full mt-6" :disabled="isProcessingRequest || !canSubmit" />
    </form>
  </div>
</template>
