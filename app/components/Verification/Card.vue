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
  verifyPhone,
  verifyPin,
  sendPinCode
} = useVerification()

const inputValue = ref('')

async function handleSubmit() {
  if (props.type === 'phone') {
    const success = await verifyPhone(inputValue.value)
    if (success) {
      await sendPinCode()
      emit('send-pin')
    }
    emit('verified', success)
  } else {
    const success = await verifyPin(inputValue.value)
    emit('verified', success)
  }
}

const currentError = computed(() => {
  return props.type === 'phone' ? errors.value.phone : errors.value.pin
})

const isVerified = computed(() => {
  return props.type === 'phone' ? isPhoneVerified.value : isPinVerified.value
})
</script>

<template>
  <form class="space-y-8" @submit.prevent="handleSubmit">
    <LucidePhoneCall v-if="type === 'phone'" :size="36" />
    <LucideShieldCheck v-else :size="36" />

    <h1 class="text-3xl text-[#001954]">
      {{ type === 'phone' ? 'Télefono' : 'Verifica' }}
    </h1>

    <div class="space-y-2">
      <UIFormInput
        :id="type"
        v-model="inputValue"
        :label="type === 'phone' ? 'Número de télefono' : 'Código PIN'"
        :type="type === 'phone' ? 'tel' : 'number'"
        :placeholder="type === 'phone' ? 'Número de 10 dígitos' : 'Ingresa el código de 6 dígitos'"
        class-name="mt-4"
      />

      <p v-if="currentError" class="text-red-500 text-sm">
        {{ currentError }}
      </p>

      <p v-if="isVerified" class="text-green-500 text-sm">
        {{ type === 'phone' ? 'Teléfono verificado correctamente' : 'PIN verificado correctamente' }}
      </p>
    </div>

    <UIButtonAction
      :label="isLoading ? 'Verificando...' : 'Continuar'"
      type="submit"
      class="mt-6 w-full"
      :disabled="isLoading || !inputValue.trim()"
    />
  </form>
</template>