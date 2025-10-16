export function useStoreStatus() {
  const { isStoreOpen } = useStoreStatusApi()
  const modal = useStoreStatusModal()

  const isCartDisabled = computed(() => !isStoreOpen.value)

  // Observar cambios en el estado y mostrar modal cuando esté cerrado
  watch(isStoreOpen, (newValue) => {
    if (!newValue) {
      modal.showModal()
    }
  }, { immediate: true })

  return {
    isStoreOpen,
    isCartDisabled,
    isModalVisible: modal.isModalVisible,
    navigateToProducts: modal.navigateToProducts,
    openStoreLocation: modal.openStoreLocation
  }
}