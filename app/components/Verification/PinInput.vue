<script setup lang="ts">
interface Props {
  modelValue: string[]
  error?: string
  isVerified?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
  (e: 'complete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const pinRefs = ref<HTMLInputElement[]>([])

const pinInputs = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Manejar input de PIN (auto-focus al siguiente)
function handlePinInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value

  // Solo permitir números
  if (value && !/^\d$/.test(value)) {
    input.value = ''
    return
  }

  const newPinInputs = [...pinInputs.value]
  newPinInputs[index] = value
  pinInputs.value = newPinInputs

  // Auto-focus al siguiente input
  if (value && index < 3) {
    pinRefs.value[index + 1]?.focus()
  }

  // Auto-submit cuando se completan los 4 dígitos
  if (index === 3 && value) {
    const allFilled = newPinInputs.every(v => v !== '')
    if (allFilled) {
      emit('complete')
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

  const newPinInputs = [...pinInputs.value]
  digits.forEach((digit, index) => {
    if (index < 4) {
      newPinInputs[index] = digit
    }
  })
  pinInputs.value = newPinInputs

  // Focus en el último input con valor
  const lastIndex = Math.min(digits.length - 1, 3)
  pinRefs.value[lastIndex]?.focus()

  // Si se completaron los 4 dígitos, emitir complete
  if (digits.length === 4) {
    emit('complete')
  }
}
</script>

<template>
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
        'border-red-500': error,
        'border-green-500 bg-green-50': isVerified,
        'bg-[#001954] text-white border-[#001954]': pinInputs[index]
      }"
      @input="handlePinInput(index, $event)"
      @keydown="handlePinKeydown(index, $event)"
      @paste="index === 0 ? handlePinPaste($event) : null"
    />
  </div>
</template>