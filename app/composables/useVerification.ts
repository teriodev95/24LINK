const VERIFIED_PHONE_KEY = 'verified_phone'
const TEMP_PHONE_KEY = 'temp_verification_phone'

export const useVerification = () => {
  const orderStore = useOrderStore()
  const verificationApi = useVerificationApi()

  // Estado local de la instancia
  const phoneNumber = ref('')
  const pinCode = ref('')
  const validationErrors = ref<{ phone?: string; pin?: string }>({})
  const isPhoneNumberValid = ref(false)
  const isPinCodeValid = ref(false)

  // Computed para el estado de carga desde la API
  const isProcessingRequest = computed(() => verificationApi.isLoading.value)

  // Cargar teléfono desde sessionStorage o localStorage
  onMounted(() => {
    if (typeof window !== 'undefined') {
      // Primero intentar con teléfono temporal (en proceso de verificación)
      const tempPhone = sessionStorage.getItem(TEMP_PHONE_KEY)
      if (tempPhone && !phoneNumber.value) {
        phoneNumber.value = tempPhone
        console.log('📱 Teléfono temporal cargado:', tempPhone)
      }

      // Luego verificar si hay sesión guardada
      const savedPhone = localStorage.getItem(VERIFIED_PHONE_KEY)
      if (savedPhone) {
        phoneNumber.value = savedPhone
        orderStore.setPhone(savedPhone)
        console.log('✅ Teléfono verificado cargado:', savedPhone)
      }
    }
  })

  const validatePhoneNumber = async (inputPhoneNumber: string): Promise<boolean> => {
    validationErrors.value.phone = ''

    // Validar que el teléfono tenga exactamente 10 dígitos
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(inputPhoneNumber)) {
      validationErrors.value.phone = 'El teléfono debe tener exactamente 10 dígitos'
      return false
    }

    phoneNumber.value = inputPhoneNumber
    isPhoneNumberValid.value = true

    // Guardar temporalmente en sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(TEMP_PHONE_KEY, inputPhoneNumber)
      console.log('💾 Teléfono guardado temporalmente:', inputPhoneNumber)
    }

    return true
  }

  const sendVerificationCode = async (): Promise<boolean> => {
    const result = await verificationApi.sendPin(phoneNumber.value)

    if (!result.success && result.error) {
      validationErrors.value.phone = result.error
    }

    return result.success
  }

  const validatePinCode = async (inputPinCode: string): Promise<boolean> => {
    validationErrors.value.pin = ''

    // Validar que el PIN tenga 4 dígitos
    const pinRegex = /^\d{4}$/
    if (!pinRegex.test(inputPinCode)) {
      validationErrors.value.pin = 'El PIN debe tener exactamente 4 dígitos'
      return false
    }

    // Verificar PIN
    const pinResult = await verificationApi.verifyPin(phoneNumber.value, inputPinCode)

    if (!pinResult.success) {
      if (pinResult.error) {
        validationErrors.value.pin = pinResult.error
      }
      return false
    }

    pinCode.value = inputPinCode
    isPinCodeValid.value = true

    // Guardar el teléfono en localStorage para sesión persistente
    if (typeof window !== 'undefined') {
      localStorage.setItem(VERIFIED_PHONE_KEY, phoneNumber.value)
      sessionStorage.removeItem(TEMP_PHONE_KEY) // Limpiar teléfono temporal
    }

    // Guardar en el order store
    orderStore.setPhone(phoneNumber.value)

    // Crear o buscar usuario
    const userResult = await verificationApi.createOrFindUser(phoneNumber.value, inputPinCode)

    if (!userResult.success) {
      console.error('Error al manejar usuario:', userResult.error)
    }

    return true
  }

  const clearVerificationState = () => {
    phoneNumber.value = ''
    pinCode.value = ''
    isPhoneNumberValid.value = false
    isPinCodeValid.value = false
    validationErrors.value = {}
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(TEMP_PHONE_KEY)
    }
  }

  const clearUserSession = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(VERIFIED_PHONE_KEY)
      sessionStorage.removeItem(TEMP_PHONE_KEY)
    }
    clearVerificationState()
  }

  const hasActiveVerifiedSession = computed(() => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(VERIFIED_PHONE_KEY)
  })

  return {
    phoneNumber: readonly(phoneNumber),
    pinCode: readonly(pinCode),
    isProcessingRequest: readonly(isProcessingRequest),
    validationErrors: readonly(validationErrors),
    isPhoneNumberValid: readonly(isPhoneNumberValid),
    isPinCodeValid: readonly(isPinCodeValid),
    hasActiveVerifiedSession,
    validatePhoneNumber,
    validatePinCode,
    sendVerificationCode,
    clearVerificationState,
    clearUserSession
  }
}