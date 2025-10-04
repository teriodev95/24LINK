const WHATSAPP_API_BASE = 'https://whatsapp-pin-validator-worker.clvrt.workers.dev'
const VERIFIED_PHONE_KEY = 'verified_phone'
const TEMP_PHONE_KEY = 'temp_verification_phone'

// Estado global compartido entre todas las instancias
const globalPhone = ref('')
const globalPin = ref('')
const globalIsLoading = ref(false)
const globalErrors = ref<{ phone?: string; pin?: string }>({})
const globalIsPhoneVerified = ref(false)
const globalIsPinVerified = ref(false)

export const useVerification = () => {
  const orderStore = useOrderStore()

  // Cargar teléfono desde sessionStorage o localStorage
  onMounted(() => {
    if (typeof window !== 'undefined') {
      // Primero intentar con teléfono temporal (en proceso de verificación)
      const tempPhone = sessionStorage.getItem(TEMP_PHONE_KEY)
      if (tempPhone && !globalPhone.value) {
        globalPhone.value = tempPhone
        console.log('📱 Teléfono temporal cargado:', tempPhone)
      }

      // Luego verificar si hay sesión guardada
      const savedPhone = localStorage.getItem(VERIFIED_PHONE_KEY)
      if (savedPhone) {
        globalPhone.value = savedPhone
        orderStore.setPhone(savedPhone)
        console.log('✅ Teléfono verificado cargado:', savedPhone)
      }
    }
  })

  const verifyPhone = async (phoneNumber: string): Promise<boolean> => {
    globalIsLoading.value = true
    globalErrors.value.phone = ''

    // Validar que el teléfono tenga exactamente 10 dígitos
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(phoneNumber)) {
      globalErrors.value.phone = 'El teléfono debe tener exactamente 10 dígitos'
      globalIsLoading.value = false
      return false
    }

    globalPhone.value = phoneNumber
    globalIsPhoneVerified.value = true

    // Guardar temporalmente en sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(TEMP_PHONE_KEY, phoneNumber)
      console.log('💾 Teléfono guardado temporalmente:', phoneNumber)
    }

    return true
  }

  const sendPinCode = async (): Promise<boolean> => {
    globalIsLoading.value = true

    try {
      // Concatenar 52 (código de país México) al número
      const fullNumber = `52${globalPhone.value}`

      console.log('📞 Enviando PIN a:', fullNumber)

      const response = await fetch(`${WHATSAPP_API_BASE}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: fullNumber
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el código')
      }

      console.log('✅ PIN enviado exitosamente:', data)
      return true
    } catch (error: any) {
      console.error('❌ Error al enviar el código PIN:', error)
      globalErrors.value.phone = error.message || 'Error al enviar el código PIN. Intenta de nuevo.'
      return false
    } finally {
      globalIsLoading.value = false
    }
  }

  const verifyPin = async (pinCode: string): Promise<boolean> => {
    globalIsLoading.value = true
    globalErrors.value.pin = ''

    // Validar que el PIN tenga 4 dígitos
    const pinRegex = /^\d{4}$/
    if (!pinRegex.test(pinCode)) {
      globalErrors.value.pin = 'El PIN debe tener exactamente 4 dígitos'
      globalIsLoading.value = false
      return false
    }

    try {
      // Concatenar 52 (código de país México) al número
      const fullNumber = `52${globalPhone.value}`

      console.log('🔍 DEBUG - Verificando PIN:', {
        phoneValue: globalPhone.value,
        fullNumber: fullNumber,
        pinCode: pinCode
      })

      const payload = {
        number: fullNumber,
        pin: pinCode
      }

      console.log('📤 Enviando payload:', payload)

      const response = await fetch(`${WHATSAPP_API_BASE}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok || !data.valid) {
        throw new Error(data.error || 'PIN incorrecto')
      }

      console.log('✅ PIN verificado exitosamente:', data)

      globalPin.value = pinCode
      globalIsPinVerified.value = true

      // Guardar el teléfono en localStorage para sesión persistente
      if (typeof window !== 'undefined') {
        localStorage.setItem(VERIFIED_PHONE_KEY, globalPhone.value)
        sessionStorage.removeItem(TEMP_PHONE_KEY) // Limpiar teléfono temporal
      }

      // Guardar en el order store
      orderStore.setPhone(globalPhone.value)

      // Crear o actualizar sesión de usuario
      const { saveUser } = useAuth()
      const { $fetch: supabaseFetch } = useSupabaseApi()

      // Buscar o crear usuario en la base de datos
      try {
        const existingUsers = await supabaseFetch<Array<{ id: string; telefono: string; nombre: string; tipo: string }>>(`/usuarios?telefono=eq.${globalPhone.value}&select=id,telefono,nombre,tipo`)

        if (existingUsers && existingUsers.length > 0) {
          // Usuario existente - guardar sesión
          const user = existingUsers[0]!
          saveUser({
            id: user.id,
            telefono: user.telefono,
            nombre: user.nombre,
            tipo: user.tipo
          })
          console.log('✅ Sesión de usuario cargada:', user.id)
        } else {
          // Crear nuevo usuario
          const newUserResult = await supabaseFetch<Array<{id: string; telefono: string; nombre: string; tipo: string}>>('/usuarios', {
            method: 'POST',
            body: {
              telefono: globalPhone.value,
              nombre: 'Cliente',
              tipo: 'cliente',
              activo: true,
              pin: pinCode
            },
            additionalHeaders: {
              'Prefer': 'return=representation'
            }
          })

          if (newUserResult && newUserResult.length > 0) {
            const newUser = newUserResult[0]!
            saveUser({
              id: newUser.id,
              telefono: newUser.telefono,
              nombre: newUser.nombre,
              tipo: newUser.tipo
            })
            console.log('✅ Nuevo usuario creado y sesión guardada:', newUser.id)
          }
        }
      } catch (err) {
        console.error('Error al manejar usuario:', err)
      }

      return true
    } catch (error: any) {
      console.error('❌ Error al verificar el PIN:', error)
      globalErrors.value.pin = error.message || 'PIN incorrecto. Verifica e intenta de nuevo.'
      return false
    } finally {
      globalIsLoading.value = false
    }
  }

  const resetVerification = () => {
    globalPhone.value = ''
    globalPin.value = ''
    globalIsPhoneVerified.value = false
    globalIsPinVerified.value = false
    globalErrors.value = {}
    globalIsLoading.value = false

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(TEMP_PHONE_KEY)
    }
  }

  const clearSession = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(VERIFIED_PHONE_KEY)
      sessionStorage.removeItem(TEMP_PHONE_KEY)
    }
    resetVerification()
  }

  const hasActiveSession = computed(() => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(VERIFIED_PHONE_KEY)
  })

  return {
    phone: readonly(globalPhone),
    pin: readonly(globalPin),
    isLoading: readonly(globalIsLoading),
    errors: readonly(globalErrors),
    isPhoneVerified: readonly(globalIsPhoneVerified),
    isPinVerified: readonly(globalIsPinVerified),
    hasActiveSession,
    verifyPhone,
    verifyPin,
    sendPinCode,
    resetVerification,
    clearSession
  }
}
