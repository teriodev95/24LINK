export const useInactivityTimer = (timeout = 4000) => {
  let timer: ReturnType<typeof setTimeout> | null = null

  const startTimer = (callback: () => void) => {
    clearTimer()
    timer = setTimeout(callback, timeout)
  }

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  const resetTimer = (callback: () => void) => {
    startTimer(callback)
  }

  onUnmounted(() => {
    clearTimer()
  })

  return {
    startTimer,
    clearTimer,
    resetTimer
  }
}