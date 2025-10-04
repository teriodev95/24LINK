const USER_STORAGE_KEY = 'user-session'

interface UserSession {
  id: string
  telefono: string
  nombre: string
  tipo: string
}

export function useAuth() {
  const user = ref<UserSession | null>(null)

  // Cargar usuario desde localStorage
  const loadUser = () => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY)
      if (stored) {
        user.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading user session:', error)
      user.value = null
    }
  }

  // Guardar usuario en localStorage
  const saveUser = (userSession: UserSession) => {
    if (typeof window === 'undefined') return

    try {
      user.value = userSession
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userSession))
    } catch (error) {
      console.error('Error saving user session:', error)
    }
  }

  // Cerrar sesión
  const logout = () => {
    if (typeof window === 'undefined') return

    user.value = null
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const userId = computed(() => user.value?.id || null)
  const userPhone = computed(() => user.value?.telefono || null)

  // Inicializar al montar
  if (typeof window !== 'undefined') {
    loadUser()
  }

  return {
    user: readonly(user),
    isAuthenticated,
    userId,
    userPhone,
    saveUser,
    logout,
    loadUser
  }
}
