import { defineStore } from 'pinia'
import type { Cart, CartProduct, Product } from '~/interfaces'

const CART_STORAGE_KEY = 'cart-data'
const SHIPPING_COST = 50 // Costo fijo de envío

const loadCartFromStorage = (): Cart => {
  if (typeof window === 'undefined') return { productos: [], subtotal: 0, costo_envio: 0, total: 0 }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) return { productos: [], subtotal: 0, costo_envio: 0, total: 0 }

    return JSON.parse(stored)
  } catch {
    return { productos: [], subtotal: 0, costo_envio: 0, total: 0 }
  }
}

const saveCartToStorage = (cart: Cart): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // Silently handle storage errors
  }
}

const calculateCartTotals = (productos: CartProduct[], deliveryCost?: number): Pick<Cart, 'subtotal' | 'costo_envio' | 'total'> => {
  const subtotal = productos.reduce((total, producto) => total + (producto.precio_unitario * producto.cantidad), 0)
  const costo_envio = productos.length > 0 ? (deliveryCost ?? SHIPPING_COST) : 0
  const total = subtotal + costo_envio

  return { subtotal, costo_envio, total }
}

export const useCartStore = defineStore('cart', () => {
  const cart = ref(loadCartFromStorage())
  const orderStore = useOrderStore()

  const getQuantity = (productId: string): number => {
    const producto = cart.value.productos.find(p => p.id === productId)
    return producto?.cantidad || 0
  }

  const hasProductInCart = (productId: string): boolean => {
    return cart.value.productos.some(p => p.id === productId)
  }

  const canAddMore = (product: Product): boolean => {
    if (!product.id) return false
    const currentQuantity = getQuantity(product.id)
    return currentQuantity < product.stock
  }

  const totalItems = computed((): number => {
    return cart.value.productos.reduce((total, producto) => total + producto.cantidad, 0)
  })

  const updateCartTotals = (): void => {
    const totals = calculateCartTotals(cart.value.productos, orderStore.deliveryCost)
    cart.value.subtotal = totals.subtotal
    cart.value.costo_envio = totals.costo_envio
    cart.value.total = totals.total
    saveCartToStorage(cart.value)
  }

  const incrementQuantity = (product: Product): void => {
    if (!product.id) return

    const existingProduct = cart.value.productos.find(p => p.id === product.id)

    if (existingProduct) {
      if (existingProduct.cantidad < product.stock) {
        existingProduct.cantidad++
        updateCartTotals()
      }
    } else {
      const cartProduct: CartProduct = {
        id: product.id,
        nombre: product.nombre,
        imagen_url: product.imagen_url,
        cantidad: 1,
        precio_unitario: product.precio
      }
      cart.value.productos.push(cartProduct)
      updateCartTotals()
    }
  }

  const decrementQuantity = (productId: string): void => {
    const productIndex = cart.value.productos.findIndex(p => p.id === productId)
    if (productIndex === -1) return

    const producto = cart.value.productos[productIndex]
    if (!producto) return

    if (producto.cantidad > 1) {
      producto.cantidad--
    } else {
      cart.value.productos.splice(productIndex, 1)
    }
    updateCartTotals()
  }

  const setQuantity = (product: Product, quantity: number): void => {
    if (!product.id) return

    const productIndex = cart.value.productos.findIndex(p => p.id === product.id)

    if (quantity <= 0) {
      if (productIndex !== -1) {
        cart.value.productos.splice(productIndex, 1)
      }
    } else if (quantity <= product.stock) {
      if (productIndex !== -1) {
        const existingProduct = cart.value.productos[productIndex]
        if (existingProduct) {
          existingProduct.cantidad = quantity
        }
      } else {
        const cartProduct: CartProduct = {
          id: product.id,
          nombre: product.nombre,
          imagen_url: product.imagen_url,
          cantidad: quantity,
          precio_unitario: product.precio
        }
        cart.value.productos.push(cartProduct)
      }
    }
    updateCartTotals()
  }

  const clearCart = (): void => {
    cart.value = { productos: [], subtotal: 0, costo_envio: 0, total: 0 }
    saveCartToStorage(cart.value)
  }

  // Computed para compatibilidad con el código existente
  const cartItems = computed(() => cart.value.productos)
  const totalAmount = computed(() => cart.value.total)

  return {
    cart: readonly(cart),
    getQuantity,
    hasProductInCart,
    canAddMore,
    totalItems,
    cartItems,
    totalAmount,
    incrementQuantity,
    decrementQuantity,
    setQuantity,
    clearCart,
    updateCartTotals
  }
})