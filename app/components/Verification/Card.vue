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
  isLoading,
  errors,
  isPhoneVerified,
  isPinVerified,
  phone,
  verifyPhone,
  verifyPin,
  sendPinCode
} = useVerification()

const inputValue = ref('')
const pinInputs = ref<string[]>(['', '', '', ''])
const pinRefs = ref<HTMLInputElement[]>([])

// Auto-fill teléfono guardado
onMounted(() => {
  if (props.type === 'phone' && phone.value) {
    inputValue.value = phone.value
  }
})

async function handleSubmit() {
  if (props.type === 'phone') {
    const success = await verifyPhone(inputValue.value)
    if (success) {
      await sendPinCode()
      emit('send-pin')
    }
    emit('verified', success)
  } else {
    // Para PIN, unir los 4 dígitos
    const pinValue = pinInputs.value.join('')
    const success = await verifyPin(pinValue)
    emit('verified', success)
  }
}

// Manejar input de PIN (auto-focus al siguiente)
function handlePinInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value

  // Solo permitir números
  if (value && !/^\d$/.test(value)) {
    input.value = ''
    return
  }

  pinInputs.value[index] = value

  // Auto-focus al siguiente input
  if (value && index < 3) {
    pinRefs.value[index + 1]?.focus()
  }

  // Auto-submit cuando se completan los 4 dígitos
  if (index === 3 && value) {
    const allFilled = pinInputs.value.every(v => v !== '')
    if (allFilled) {
      handleSubmit()
    }
  }
}

// Manejar backspace
function handlePinKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !pinInputs.value[index] && index > 0) {
    pinRefs.value[index - 1]?.focus()
  }
}

// Manejar paste
function handlePinPaste(event: ClipboardEvent) {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const digits = pastedData.replace(/\D/g, '').slice(0, 4).split('')

  digits.forEach((digit, index) => {
    if (index < 4) {
      pinInputs.value[index] = digit
    }
  })

  // Focus en el último input con valor
  const lastIndex = Math.min(digits.length - 1, 3)
  pinRefs.value[lastIndex]?.focus()
}

const currentError = computed(() => {
  return props.type === 'phone' ? errors.value.phone : errors.value.pin
})

const isVerified = computed(() => {
  return props.type === 'phone' ? isPhoneVerified.value : isPinVerified.value
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
    <!-- Icono con animación -->
    <div class="flex justify-center">
      <div class="relative">
        <!-- Círculo de fondo animado -->
        <div class="absolute inset-0 bg-[#001954] opacity-10 rounded-full animate-ping" />
        <div class="relative bg-[#001954] bg-opacity-10 p-4 rounded-full">
          <LucideSmartphone v-if="type === 'phone'" :size="40" class="text-[#001954]" />
          <LucideShieldCheck v-else :size="40" class="text-[#001954]" />
        </div>
      </div>
    </div>

    <!-- Título -->
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold text-[#001954]">
        {{ type === 'phone' ? 'Verificar teléfono' : 'Código de verificación' }}
      </h1>
      <p class="text-gray-600 text-sm">
        {{
          type === 'phone'
            ? 'Ingresa tu número de teléfono para recibir un código'
            : 'Ingresa el código de 4 dígitos enviado a tu WhatsApp'
        }}
      </p>
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- Input de teléfono -->
      <div v-if="type === 'phone'" class="space-y-4">
        <div class="relative">
          <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
            +52
          </div>
          <input
            v-model="inputValue"
            type="tel"
            maxlength="10"
            placeholder="4431234567"
            class="w-full pl-16 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-[#001954] focus:outline-none transition-all duration-200"
            :class="{ 'border-red-500': currentError, 'border-green-500': isVerified }"
          />
        </div>
      </div>

      <!-- Input de PIN (4 dígitos) -->
      <div v-else class="space-y-4">
        <div class="flex justify-center gap-3">
          <input
            v-for="(digit, index) in pinInputs"
            :key="index"
            ref="pinRefs"
            v-model="pinInputs[index]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-200 rounded-2xl focus:border-[#001954] focus:outline-none transition-all duration-200 transform focus:scale-105"
            :class="{
              'border-red-500': currentError,
              'border-green-500 bg-green-50': isVerified,
              'bg-[#001954] text-white border-[#001954]': pinInputs[index]
            }"
            @input="handlePinInput(index, $event)"
            @keydown="handlePinKeydown(index, $event)"
            @paste="index === 0 ? handlePinPaste($event) : null"
          />
        </div>
      </div>

      <!-- Mensajes de error/éxito con animación -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 transform translate-y-2"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 transform translate-y-0"
        leave-to-class="opacity-0 transform translate-y-2"
      >
        <div v-if="currentError || isVerified" class="mt-4">
          <div
            v-if="currentError"
            class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
          >
            <LucideAlertCircle :size="16" />
            <span>{{ currentError }}</span>
          </div>

          <div
            v-if="isVerified"
            class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm"
          >
            <LucideCheckCircle2 :size="16" />
            <span>{{ type === 'phone' ? 'Código enviado exitosamente' : 'Código verificado' }}</span>
          </div>
        </div>
      </Transition>

      <!-- Botón de submit -->
      <UIButtonAction
        v-if="type === 'phone'"
        :label="isLoading ? 'Enviando...' : 'Enviar código'"
        type="submit"
        class-name="w-full mt-6"
        :disabled="isLoading || !canSubmit"
      />

      <!-- Loading indicator para PIN (auto-submit) -->
      <div v-if="type === 'pin' && isLoading" class="mt-6 flex justify-center">
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
