interface VerificationResponse {
  valid?: boolean
  error?: string
}

interface CreatePinResponse {
  success?: boolean
  error?: string
}

interface ExistingUser {
  id: string
  telefono: string
  nombre: string
  tipo: string
}

interface NewUser {
  id: string
  telefono: string
  nombre: string
  tipo: string
}

export function useVerificationApi() {
  const { $fetch: supabaseFetch } = useSupabaseApi()
  const { saveUser } = useAuth()

  // State
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const WHATSAPP_API_BASE = 'https://whatsapp-pin-validator-worker.clvrt.workers.dev'

  const sendPin = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true
    error.value = null

    try {
      // Concatenar 52 (código de país México) al número
      const fullNumber = `52${phoneNumber}`

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

      const data: CreatePinResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el código')
      }

      console.log('✅ PIN enviado exitosamente:', data)
      return { success: true }
    } catch (err: unknown) {
      console.error('❌ Error al enviar el código PIN:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar el código PIN. Intenta de nuevo.'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const verifyPin = async (phoneNumber: string, pinCode: string): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true
    error.value = null

    try {
      // Concatenar 52 (código de país México) al número
      const fullNumber = `52${phoneNumber}`

      console.log('🔍 DEBUG - Verificando PIN:', {
        phoneValue: phoneNumber,
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

      const data: VerificationResponse = await response.json()

      if (!response.ok || !data.valid) {
        throw new Error(data.error || 'PIN incorrecto')
      }

      console.log('✅ PIN verificado exitosamente:', data)
      return { success: true }
    } catch (err: unknown) {
      console.error('❌ Error al verificar el PIN:', err)
      const errorMessage = err instanceof Error ? err.message : 'PIN incorrecto. Verifica e intenta de nuevo.'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const createOrFindUser = async (phoneNumber: string, pinCode: string): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true
    error.value = null

    try {
      // Buscar usuario existente
      const existingUsers = await supabaseFetch<ExistingUser[]>(`/usuarios?telefono=eq.${phoneNumber}&select=id,telefono,nombre,tipo`)

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
        return { success: true }
      } else {
        // Crear nuevo usuario
        const newUserResult = await supabaseFetch<NewUser[]>('/usuarios', {
          method: 'POST',
          body: {
            telefono: phoneNumber,
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
          return { success: true }
        } else {
          throw new Error('Error al crear el usuario')
        }
      }
    } catch (err: unknown) {
      console.error('Error al manejar usuario:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar el usuario'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  return {
    sendPin,
    verifyPin,
    createOrFindUser,
    isLoading: readonly(isLoading),
    error: readonly(error)
  }
}