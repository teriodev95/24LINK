export function useStoreStatusModal() {
  const isModalVisible = ref(false)

  const showModal = () => {
    isModalVisible.value = true
  }

  const hideModal = () => {
    isModalVisible.value = false
  }

  const navigateToProducts = () => {
    hideModal()
    // Modal se oculta y usuario puede ver productos
  }

  const openStoreLocation = () => {
    window.open('https://maps.app.goo.gl/vXZ7xbx5iS9YUsYLA', '_blank')
  }

  return {
    isModalVisible: readonly(isModalVisible),
    showModal,
    hideModal,
    navigateToProducts,
    openStoreLocation
  }
}