export const useProductQuantity = (maxStock: Ref<number>) => {
  const quantity = ref(0)
  const quantityInput = ref<HTMLInputElement>()
  const isEditing = ref(false)
  const tempQuantity = ref(0)

  const hasProductInCart = computed(() => quantity.value > 0)
  const canAddMore = computed(() => quantity.value < maxStock.value)
  const canDecrease = computed(() => quantity.value > 0)

  const setQuantity = (value: number) => {
    quantity.value = Math.max(0, Math.min(value, maxStock.value))
  }

  const increment = () => {
    if (canAddMore.value) {
      setQuantity(quantity.value + 1)
    }
  }

  const decrement = () => {
    if (canDecrease.value) {
      setQuantity(quantity.value - 1)
    }
  }

  const startEdit = async (onInteraction?: () => void) => {
    tempQuantity.value = quantity.value
    isEditing.value = true
    onInteraction?.()

    await nextTick()
    quantityInput.value?.focus()
    quantityInput.value?.select()
  }

  const saveEdit = (onSave?: (value: number) => void) => {
    const validValue = Math.max(0, Math.min(tempQuantity.value, maxStock.value))
    if (onSave) {
      onSave(validValue)
    } else {
      setQuantity(validValue)
    }
    isEditing.value = false
  }

  const cancelEdit = () => {
    isEditing.value = false
  }

  const handleInput = (onInteraction?: () => void) => {
    tempQuantity.value = Math.floor(Math.abs(tempQuantity.value))
    onInteraction?.()
  }

  return {
    quantity: readonly(quantity),
    quantityInput,
    isEditing: readonly(isEditing),
    tempQuantity,
    hasProductInCart,
    canAddMore,
    canDecrease,
    setQuantity,
    increment,
    decrement,
    startEdit,
    saveEdit,
    cancelEdit,
    handleInput
  }
}