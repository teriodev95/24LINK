export const useVerification = () => {
  const phone = ref('')
  const pin = ref('')
  const isLoading = ref(false)
  const errors = ref<{ phone?: string; pin?: string }>({})
  const isPhoneVerified = ref(false)
  const isPinVerified = ref(false)

  const verifyPhone = async (phoneNumber: string): Promise<boolean> => {
    isLoading.value = true
    errors.value.phone = ''

    // Validar que el teléfono tenga exactamente 10 dígitos
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(phoneNumber)) {
      errors.value.phone = 'El teléfono debe tener exactamente 10 dígitos'
      isLoading.value = false
      return false
    }

    try {
      // TODO: Implementar llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000))

      phone.value = phoneNumber
      isPhoneVerified.value = true
      return true
    } catch {
      errors.value.phone = 'Error al verificar el teléfono'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const verifyPin = async (pinCode: string): Promise<boolean> => {
    isLoading.value = true
    errors.value.pin = ''

    try {
      // TODO: Implementar llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000))

      pin.value = pinCode
      isPinVerified.value = true
      return true
    } catch {
      errors.value.pin = 'PIN incorrecto'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const sendPinCode = async (): Promise<boolean> => {
    isLoading.value = true

    try {
      // TODO: Implementar llamada a la API para enviar PIN
      await new Promise(resolve => setTimeout(resolve, 1000))

      return true
    } catch {
      errors.value.phone = 'Error al enviar el código PIN'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const resetVerification = () => {
    phone.value = ''
    pin.value = ''
    isPhoneVerified.value = false
    isPinVerified.value = false
    errors.value = {}
    isLoading.value = false
  }

  return {
    phone: readonly(phone),
    pin: readonly(pin),
    isLoading: readonly(isLoading),
    errors: readonly(errors),
    isPhoneVerified: readonly(isPhoneVerified),
    isPinVerified: readonly(isPinVerified),
    verifyPhone,
    verifyPin,
    sendPinCode,
    resetVerification
  }
}