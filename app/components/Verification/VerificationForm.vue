<script setup lang="ts">
interface Props {
  type: 'phone' | 'pin'
}

interface Emits {
  (e: 'verified', success: boolean): void
  (e: 'send-pin'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  isProcessingRequest,
  validationErrors,
  isPhoneNumberValid,
  isPinCodeValid,
  phoneNumber,
  validatePhoneNumber,
  validatePinCode,
  sendVerificationCode
} = useVerification()

const inputValue = ref('')
const pinInputs = ref<string[]>(['', '', '', ''])

// Auto-fill teléfono guardado
onMounted(() => {
  if (props.type === 'phone' && phoneNumber.value) {
    inputValue.value = phoneNumber.value
  }
})

async function handleSubmit() {
  if (props.type === 'phone') {
    const success = await validatePhoneNumber(inputValue.value)
    if (success) {
      await sendVerificationCode()
      emit('send-pin')
    }
    emit('verified', success)
  } else {
    // Para PIN, unir los 4 dígitos
    const pinValue = pinInputs.value.join('')
    const success = await validatePinCode(pinValue)
    emit('verified', success)
  }
}

// Manejar auto-submit del PIN
function handlePinComplete() {
  handleSubmit()
}

const currentError = computed(() => {
  return props.type === 'phone' ? validationErrors.value.phone : validationErrors.value.pin
})

const isVerified = computed(() => {
  return props.type === 'phone' ? isPhoneNumberValid.value : isPinCodeValid.value
})

const canSubmit = computed(() => {
  if (props.type === 'phone') {
    return inputValue.value.trim().length === 10
  } else {
    return pinInputs.value.every(v => v !== '')
  }
})
</script>

<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <VerificationHeader :type="type" />

    <form @submit.prevent="handleSubmit">
      <!-- Input de teléfono -->
      <div v-if="type === 'phone'" class="space-y-4">
        <VerificationPhoneInput v-model="inputValue" :error="currentError" :is-verified="isVerified" />
      </div>

      <!-- Input de PIN (4 dígitos) -->
      <div v-else class="space-y-4">
        <VerificationPinInput v-model="pinInputs" :error="currentError" :is-verified="isVerified"
          @complete="handlePinComplete" />
      </div>

      <!-- Mensajes de error/éxito con animación -->
      <div class="mt-4">
        <VerificationStatusMessage :type="type" :error="currentError" :is-verified="isVerified" />
      </div>

      <!-- Botón de submit -->
      <UIButtonAction v-if="type === 'phone'" :label="isProcessingRequest ? 'Enviando...' : 'Enviar código'"
        type="submit" class-name="w-full mt-6" :disabled="isProcessingRequest || !canSubmit" />

      <!-- Loading indicator para PIN (auto-submit) -->
      <div v-if="type === 'pin' && isProcessingRequest" class="mt-6 flex justify-center">
        <div class="flex items-center gap-2 text-[#001954]">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-[#001954]" />
          <span class="text-sm">Verificando...</span>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Animaciones personalizadas */
@keyframes slide-in-from-bottom-4 {
  from {
    transform: translateY(1rem);
  }

  to {
    transform: translateY(0);
  }
}

.animate-in {
  animation-fill-mode: both;
}

.slide-in-from-bottom-4 {
  animation-name: slide-in-from-bottom-4;
}

.fade-in {
  animation-name: fade-in;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Eliminar flechas de input number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>