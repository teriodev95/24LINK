import type { Product } from '~/interfaces/product.interface'

export function useProductCart(product: Ref<Product>) {
  const cartStore = useCartStore()

  const quantity = computed(() => cartStore.getQuantity(product.value.id))
  const hasProductInCart = computed(() => cartStore.hasProductInCart(product.value.id))
  const canAddMore = computed(() => cartStore.canAddMore(product.value))

  const increment = () => {
    cartStore.incrementQuantity(product.value)
  }

  const decrement = () => {
    cartStore.decrementQuantity(product.value.id)
  }

  const setQuantity = (newQuantity: number) => {
    if (newQuantity >= 0 && newQuantity <= product.value.stock) {
      cartStore.setQuantity(product.value, newQuantity)
    }
  }

  return {
    quantity,
    hasProductInCart,
    canAddMore,
    increment,
    decrement,
    setQuantity
  }
}