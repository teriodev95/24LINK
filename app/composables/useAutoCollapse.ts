interface AutoCollapseOptions {
  timeout?: number
  onCollapse: () => void
}

export const useAutoCollapse = ({ timeout = 4000, onCollapse }: AutoCollapseOptions) => {
  const { startTimer, clearTimer } = useInactivityTimer(timeout)

  const handleInteraction = () => {
    startTimer(onCollapse)
  }

  const resetTimer = () => {
    handleInteraction()
  }

  const stopTimer = () => {
    clearTimer()
  }

  return {
    handleInteraction,
    resetTimer,
    stopTimer
  }
}