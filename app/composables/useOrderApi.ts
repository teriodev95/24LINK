export function useOrderApi() {
  const { $fetch: supabaseFetch } = useSupabaseApi()
  const cartStore = useCartStore()
  const orderStore = useOrderStore()
  const { userId } = useAuth()

  const isCreatingOrder = ref(false)
  const orderError = ref<string | null>(null)

  const createOrder = async () => {
    isCreatingOrder.value = true
    orderError.value = null

    try {
      console.log('🚀 Iniciando creación de pedido...')

      // Validar que hay productos en el carrito
      if (!cartStore.cart.productos.length) {
        throw new Error('El carrito está vacío')
      }

      // Validar que se puede crear la orden
      if (!orderStore.canPlaceOrder) {
        throw new Error('Faltan datos para crear el pedido')
      }

      // 1. Obtener usuario de la sesión
      console.log('👤 Obteniendo usuario de la sesión...')
      const usuarioId = userId.value

      if (!usuarioId) {
        throw new Error('No hay sesión de usuario activa. Por favor verifica tu teléfono.')
      }

      console.log('✅ Usuario ID:', usuarioId)

      // 2. Crear/obtener dirección
      console.log('📍 Creando/obteniendo dirección...')
      const direccionId = await createOrGetAddress(usuarioId)
      console.log('✅ Dirección ID:', direccionId)

      // 3. Generar número de pedido único (máx 20 caracteres)
      // Formato: ORD-{últimos 8 dígitos del timestamp}-{random}
      const timestamp = Date.now().toString().slice(-8)
      const random = Math.random().toString(36).substr(2, 4).toUpperCase()
      const numeroPedido = `ORD-${timestamp}-${random}` // Ej: ORD-93837384-X7K2 (17 chars)

      // 4. Preparar datos del pedido (sin id, se genera automáticamente)
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

      // 5. Crear pedido
      const pedidoResult = await supabaseFetch<Array<{id: string}>>('/pedidos', {
        method: 'POST',
        body: pedidoPayload,
        additionalHeaders: {
          'Prefer': 'return=representation'
        }
      })

      console.log('✅ Pedido creado:', pedidoResult)

      // Obtener el ID del pedido creado
      const pedidoId = Array.isArray(pedidoResult) ? pedidoResult[0]?.id : pedidoResult?.id

      if (!pedidoId) {
        throw new Error('No se pudo obtener el ID del pedido creado')
      }

      // 6. Crear detalles del pedido (sin id, se generan automáticamente)
      const detalles = cartStore.cart.productos.map(producto => ({
        pedido_id: pedidoId,
        producto_id: producto.id,
        cantidad: producto.cantidad,
        precio_unitario: producto.precio_unitario,
        descuento_aplicado: 0,
        subtotal: producto.precio_unitario * producto.cantidad
      }))

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
    } catch (error: any) {
      console.error('❌ Error creating order:', error)
      console.error('Error details:', error?.data || error?.message || error)

      const errorMessage = error?.data?.message || error?.message || 'Error al crear el pedido'
      orderError.value = errorMessage

      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isCreatingOrder.value = false
    }
  }

  const createOrGetAddress = async (usuarioId: string): Promise<string> => {
    const selectedAddress = orderStore.selectedAddress
    const deliveryLocation = orderStore.deliveryLocation

    if (!selectedAddress) {
      throw new Error('No hay dirección seleccionada')
    }

    // Si la dirección tiene ID y no es temporal, verificar si existe
    if (selectedAddress.id && !selectedAddress.id.startsWith('temp-') && selectedAddress.id !== '1') {
      return selectedAddress.id
    }

    // Crear nueva dirección (sin id, se genera automáticamente)
    const newAddressResult = await supabaseFetch<Array<{id: string}>>('/direcciones', {
      method: 'POST',
      body: {
        usuario_id: usuarioId,
        nombre: 'Dirección principal',
        calle: selectedAddress.street || '',
        numero_exterior: 'S/N',
        colonia: selectedAddress.colony || '',
        codigo_postal: '00000',
        latitud: deliveryLocation?.lat || 0,
        longitud: deliveryLocation?.lng || 0,
        referencias: selectedAddress.colony || '',
        es_predeterminada: true
      },
      additionalHeaders: {
        'Prefer': 'return=representation'
      }
    })

    const direccionId = Array.isArray(newAddressResult) ? newAddressResult[0]?.id : newAddressResult?.id

    if (!direccionId) {
      throw new Error('No se pudo crear la dirección')
    }

    return direccionId
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
