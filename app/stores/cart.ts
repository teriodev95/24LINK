import { defineStore } from 'pinia'
import type { Cart, CartProduct, Product } from '~/interfaces'

const CART_STORAGE_KEY = 'cart-productos'

const loadProductsFromStorage = (): CartProduct[] => {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) return []

    return JSON.parse(stored)
  } catch {
    return []
  }
}

const saveProductsToStorage = (productos: CartProduct[]): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(productos))
  } catch {
    // Silently handle storage errors
  }
}

const calculateCartTotals = (productos: CartProduct[], deliveryCost?: number): Pick<Cart, 'subtotal' | 'costo_envio' | 'total'> => {
  const subtotal = productos.reduce((total, producto) => total + (producto.precio_unitario * producto.cantidad), 0)

  // Si no hay productos, el costo de envío es 0
  // Si no se proporciona deliveryCost, el costo de envío es 0 (sin dirección válida)
  // Solo usar SHIPPING_COST como fallback cuando hay deliveryCost definido
  const costo_envio = productos.length > 0 && deliveryCost !== undefined ? (deliveryCost) : 0
  const total = subtotal + costo_envio

  return { subtotal, costo_envio, total }
}

export const useCartStore = defineStore('cart', () => {
  const productos = ref<CartProduct[]>(loadProductsFromStorage())
  const orderStore = useOrderStore()

  // Computed cart que siempre calcula totales en tiempo real
  const cart = computed((): Cart => {
    const hasValidAddress = orderStore.isValidAddress
    const deliveryCost = hasValidAddress ? orderStore.deliveryCost : undefined
    const totals = calculateCartTotals(productos.value, deliveryCost)

    return {
      productos: productos.value,
      ...totals
    }
  })

  const getQuantity = (productId: string): number => {
    const producto = productos.value.find(p => p.id === productId)
    return producto?.cantidad || 0
  }

  const hasProductInCart = (productId: string): boolean => {
    return productos.value.some(p => p.id === productId)
  }

  const canAddMore = (product: Product): boolean => {
    if (!product.id) return false
    const currentQuantity = getQuantity(product.id)
    return currentQuantity < product.stock
  }

  const totalItems = computed((): number => {
    return productos.value.reduce((total, producto) => total + producto.cantidad, 0)
  })

  // Función para guardar productos en localStorage
  const saveProducts = (): void => {
    saveProductsToStorage(productos.value)
  }

  const incrementQuantity = (product: Product): void => {
    if (!product.id) return

    const existingProduct = productos.value.find(p => p.id === product.id)

    if (existingProduct) {
      if (existingProduct.cantidad < product.stock) {
        existingProduct.cantidad++
        saveProducts()
      }
    } else {
      const cartProduct: CartProduct = {
        id: product.id,
        nombre: product.nombre,
        imagen_url: product.imagen_url,
        cantidad: 1,
        precio_unitario: product.precio
      }
      productos.value.push(cartProduct)
      saveProducts()
    }
  }

  const decrementQuantity = (productId: string): void => {
    const productIndex = productos.value.findIndex(p => p.id === productId)
    if (productIndex === -1) return

    const producto = productos.value[productIndex]
    if (!producto) return

    if (producto.cantidad > 1) {
      producto.cantidad--
    } else {
      productos.value.splice(productIndex, 1)
    }
    saveProducts()
  }

  const setQuantity = (product: Product, quantity: number): void => {
    if (!product.id) return

    const productIndex = productos.value.findIndex(p => p.id === product.id)

    if (quantity <= 0) {
      if (productIndex !== -1) {
        productos.value.splice(productIndex, 1)
      }
    } else if (quantity <= product.stock) {
      if (productIndex !== -1) {
        const existingProduct = productos.value[productIndex]
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
        productos.value.push(cartProduct)
      }
    }
    saveProducts()
  }

  const clearCart = (): void => {
    productos.value = []
    saveProducts()
  }

  // Computed para compatibilidad con el código existente
  const cartItems = computed(() => productos.value)
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
    clearCart
  }
})