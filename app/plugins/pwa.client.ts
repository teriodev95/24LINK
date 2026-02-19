export default defineNuxtPlugin(() => {
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registrado:', registration.scope)

      // Verificar actualizaciones periódicamente (cada 60 segundos)
      setInterval(() => {
        registration.update()
      }, 60 * 1000)

      // Cuando hay un nuevo SW esperando, forzar activación
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            // Nuevo SW activo → recargar para obtener la versión más reciente
            window.location.reload()
          }
        })
      })
    } catch (error) {
      console.error('Error al registrar Service Worker:', error)
    }
  })
})
