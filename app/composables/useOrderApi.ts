import type { CreateOrderResponse } from "~/interfaces"

export function useOrderApi() {
  const { $fetch: supabaseFetch } = useSupabaseApi()
  const cartStore = useCartStore()
  const orderStore = useOrderStore()
  const { userId } = useAuth()

  const isCreatingOrder = ref(false)
  const orderError = ref<string | null>(null)

  const validateOrderRequirements = () => {
    if (!cartStore.cart.productos.length) throw new Error('El carrito está vacío')
    
    if (!orderStore.canPlaceOrder) throw new Error('Faltan datos para crear el pedido')

    const usuarioId = userId.value
    if (!usuarioId) throw new Error('No hay sesión de usuario activa. Por favor verifica tu teléfono.')

    const selectedAddress = orderStore.selectedAddress
    if (!selectedAddress?.id) throw new Error('No hay dirección seleccionada para el pedido')

    return {
      usuarioId,
      direccionId: selectedAddress.id
    }
  }

  const createOrder = async () => {
    isCreatingOrder.value = true
    orderError.value = null

    try {
      console.log('🚀 Iniciando creación de pedido...')

      // 1. Validar todos los requisitos
      const { usuarioId, direccionId } = validateOrderRequirements()

      // 2. Generar número de pedido único (máx 20 caracteres)
      const timestamp = Date.now().toString().slice(-8)
      const random = Math.random().toString(36).substr(2, 4).toUpperCase()
      const numeroPedido = `ORD-${timestamp}-${random}` // Ej: ORD-93837384-X7K2 (17 chars)

      // 3. Preparar datos del pedido (sin id, se genera automáticamente)
      const pedidoPayload = {
        usuario_id: usuarioId,
        direccion_id: direccionId,
        numero_pedido: numeroPedido,
        estado: 'nuevo',
        medio_pago: mapPaymentMethod(orderStore.selectedPaymentMethod?.type || 'cash'),
        subtotal: cartStore.cart.subtotal,
        descuento: 0,
        total: cartStore.cart.total,
        costo_envio: cartStore.cart.costo_envio,
        instrucciones_entrega: orderStore.selectedDeliveryMethod?.title || ''
      }

      console.log('🛒 Creando pedido:', pedidoPayload)

      // 4. Crear pedido
      const pedidoResult = await supabaseFetch<CreateOrderResponse[]>('/pedidos', {
        method: 'POST',
        body: pedidoPayload,
        additionalHeaders: {
          'Prefer': 'return=representation'
        }
      })

      console.log('✅ Pedido creado:', pedidoResult)
      console.log('📄 Obteniendo ID del pedido creado...')
      
      const pedidoId = pedidoResult.length ? pedidoResult[0]!.id : null

      if (!pedidoId) {
        throw new Error('No se pudo obtener el ID del pedido creado')
      }

      // 5. Crear detalles del pedido (sin id, se generan automáticamente)
      const detalles = cartStore.cart.productos.map(producto => {
        return {
          pedido_id: pedidoId,
          producto_id: producto.id,
          cantidad: producto.cantidad,
          precio_unitario: producto.precio_unitario,
          descuento_aplicado: 0,
          subtotal: producto.precio_unitario * producto.cantidad
        }
      })

      console.log('📦 Creando detalles del pedido:', detalles)

      const detallesResult = await supabaseFetch('/pedido_detalles', {
        method: 'POST',
        body: detalles,
        additionalHeaders: {
          'Prefer': 'return=representation'
        }
      })

      console.log('✅ Detalles creados:', detallesResult)

      // 7. Limpiar carrito
      cartStore.clearCart()
      console.log('🎉 Pedido creado exitosamente!')

      return {
        success: true,
        pedidoId,
        numeroPedido
      }
    } catch (error: unknown) {
      console.error('❌ Error creating order:', error)
      console.error('Error details:', error)

      const errorMessage = (error as { data?: { message?: string } })?.data?.message || (error as Error)?.message || 'Error al crear el pedido'
      orderError.value = errorMessage

      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isCreatingOrder.value = false
    }
  }


  const mapPaymentMethod = (type: string): string => {
    const methodMap: Record<string, string> = {
      'card': 'tarjeta',
      'cash': 'efectivo',
      'mixed': 'mixto'
    }
    return methodMap[type] || 'efectivo'
  }

  return {
    createOrder,
    isCreatingOrder: readonly(isCreatingOrder),
    orderError: readonly(orderError)
  }
}
