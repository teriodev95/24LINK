// Types for PWA Install Prompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export const useInstallPrompt = () => {
  const showPrompt = ref(false)
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const isInstallable = ref(false)

  const setupInstallPrompt = () => {
    if (typeof window === 'undefined') return

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      deferredPrompt.value = e
      isInstallable.value = true
      showPrompt.value = true
    }

    const handleAppInstalled = () => {
      console.log('PWA instalada exitosamente')
      isInstallable.value = false
      showPrompt.value = false
      deferredPrompt.value = null
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Cleanup function
    const cleanup = () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }

    return cleanup
  }

  const handleInstall = async (): Promise<boolean> => {
    if (!deferredPrompt.value) return false

    try {
      await deferredPrompt.value.prompt()
      const { outcome } = await deferredPrompt.value.userChoice

      const accepted = outcome === 'accepted'
      console.log(`Usuario ${accepted ? 'aceptó' : 'rechazó'} la instalación`)

      // Reset state
      deferredPrompt.value = null
      showPrompt.value = false
      isInstallable.value = false

      return accepted
    } catch (error) {
      console.error('Error al instalar PWA:', error)
      return false
    }
  }

  const dismissPrompt = () => {
    showPrompt.value = false
  }

  const checkInstallability = (): boolean => {
    return isInstallable.value && deferredPrompt.value !== null
  }

  return {
    // State
    showPrompt: readonly(showPrompt),
    isInstallable: readonly(isInstallable),

    // Methods
    setupInstallPrompt,
    handleInstall,
    dismissPrompt,
    checkInstallability
  }
}