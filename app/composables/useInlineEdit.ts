export function useInlineEdit<T>(initialValue: Ref<T>, onSave?: (value: T) => void) {
  const isEditing = ref(false)
  const tempValue = ref<T>(initialValue.value)
  const inputRef = ref<HTMLInputElement>()

  const startEdit = () => {
    isEditing.value = true
    tempValue.value = initialValue.value
    nextTick(() => {
      inputRef.value?.focus()
      inputRef.value?.select()
    })
  }

  const saveEdit = () => {
    onSave?.(tempValue.value)
    isEditing.value = false
  }

  const cancelEdit = () => {
    tempValue.value = initialValue.value
    isEditing.value = false
  }

  watch(initialValue, (newValue) => {
    if (!isEditing.value) {
      tempValue.value = newValue
    }
  })

  return {
    isEditing: readonly(isEditing),
    tempValue,
    inputRef,
    startEdit,
    saveEdit,
    cancelEdit
  }
}