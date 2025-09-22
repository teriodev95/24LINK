export function useProductExpansion() {
  const expandedProductId = ref<string | null>(null)

  const isExpanded = (productId: string) => expandedProductId.value === productId

  const expand = (productId: string) => {
    expandedProductId.value = productId
  }

  const collapse = () => {
    expandedProductId.value = null
  }

  const toggle = (productId: string) => {
    expandedProductId.value = expandedProductId.value === productId ? null : productId
  }

  return {
    expandedProductId: readonly(expandedProductId),
    isExpanded,
    expand,
    collapse,
    toggle
  }
}