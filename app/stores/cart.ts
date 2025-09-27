import { defineStore } from 'pinia'
import type { Product } from '~/interfaces/product.interface'

interface CartItem {
  productId: string
  quantity: number
  product: Product
}

const CART_STORAGE_KEY = 'cart-items'

const loadCartFromStorage = (): Map<string, CartItem> => {
  if (typeof window === 'undefined') return new Map()

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) return new Map()

    const parsed = JSON.parse(stored)
    return new Map(Object.entries(parsed))
  } catch {
    return new Map()
  }
}

const saveCartToStorage = (items: Map<string, CartItem>): void => {
  if (typeof window === 'undefined') return

  try {
    const cartObject = Object.fromEntries(items.entries())
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartObject))
  } catch {
    // Silently handle storage errors
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadCartFromStorage())

  const getQuantity = (productId: string): number => {
    return items.value.get(productId)?.quantity || 0
  }

  const hasProductInCart = (productId: string): boolean => {
    return items.value.has(productId)
  }

  const canAddMore = (product: Product): boolean => {
    const currentQuantity = items.value.get(product.id)?.quantity || 0
    return currentQuantity < product.stock
  }

  const totalItems = computed((): number => {
    return Array.from(items.value.values()).reduce((total, item) => total + item.quantity, 0)
  })

  const cartItems = computed((): CartItem[] => {
    return Array.from(items.value.values())
  })

  const totalAmount = computed((): number => {
    return Array.from(items.value.values()).reduce((total, item) => {
      return total + (item.product.precio * item.quantity)
    }, 0)
  })

  const incrementQuantity = (product: Product): void => {
    const currentItem = items.value.get(product.id)
    const currentQuantity = currentItem?.quantity || 0

    if (currentQuantity < product.stock) {
      items.value.set(product.id, {
        productId: product.id,
        quantity: currentQuantity + 1,
        product
      })
      saveCartToStorage(items.value)
    }
  }

  const decrementQuantity = (productId: string): void => {
    const currentItem = items.value.get(productId)
    if (!currentItem) return

    if (currentItem.quantity > 1) {
      items.value.set(productId, {
        ...currentItem,
        quantity: currentItem.quantity - 1
      })
    } else {
      items.value.delete(productId)
    }
  }

  const setQuantity = (product: Product, quantity: number): void => {
    if (quantity <= 0) {
      items.value.delete(product.id)
    } else if (quantity <= product.stock) {
      items.value.set(product.id, {
        productId: product.id,
        quantity,
        product
      })
    }
  }

  const clearCart = (): void => {
    items.value.clear()
  }

  return {
    getQuantity,
    hasProductInCart,
    canAddMore,
    totalItems,
    cartItems,
    totalAmount,
    incrementQuantity,
    decrementQuantity,
    setQuantity,
    clearCart
  }
})