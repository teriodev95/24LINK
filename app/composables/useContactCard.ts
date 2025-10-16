import type { Address } from '~/interfaces'

export const useContactCard = () => {
  const { addresses, isLoading, loadAddresses } = useAddresses()
  const { recalculateOnAddressChange, isCalculating } = useDeliveryCalculator()
  const { userPhone } = useAuth()
  const orderStore = useOrderStore()

  const contactCardRef = ref<HTMLElement>()
  const showBorderAnimation = ref(false)

  const scrollToCardWithAnimation = () => {
    if (!contactCardRef.value) return

    const element = contactCardRef.value.$el || contactCardRef.value
    if (element?.scrollIntoView) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      showBorderAnimation.value = true
      setTimeout(() => {
        showBorderAnimation.value = false
      }, 2000)
    }
  }

  const handleAddressSelection = async (address: Address) => {
    orderStore.setSelectedAddress(address)
    if (address.id) {
      await recalculateOnAddressChange(address.id)
    }
  }

  const initializeContact = async () => {
    if (userPhone.value && !orderStore.phone) {
      orderStore.setPhone(userPhone.value)
    }
    await loadAddresses()
  }

  // Sync addresses with store
  watch(addresses, (newAddresses) => {
    if (newAddresses.length > 0) {
      orderStore.setAddressList(newAddresses)
    }
  }, { immediate: true })

  return {
    // Refs
    contactCardRef,
    showBorderAnimation,

    // Data
    addresses,
    isLoading,
    isCalculating,
    userPhone,

    // Methods
    scrollToCardWithAnimation,
    handleAddressSelection,
    initializeContact,

    // Store
    orderStore
  }
}