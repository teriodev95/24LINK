import type { MainOrderDetails, FullOrderDetails, OrderProductDetails, AddressSummary, OrderProduct, OrderWithAddress, OrderSummary } from "~/interfaces"

interface UserData {
  telefono: string
  nombre: string
}


export function useOrderApi() {
  const { $fetch: supabaseFetch } = useSupabaseApi()
  const cartStore = useCartStore()
  const orderStore = useOrderStore()
  const { userId } = useAuth()

  // Consolidated state
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Order details state
  const order = ref<FullOrderDetails>()

  // User orders list state
  const userOrders = ref<OrderWithAddress[]>([])

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

  const mapPaymentMethod = (type: string): string => {
    const methodMap: Record<string, string> = {
      'card': 'tarjeta',
      'cash': 'efectivo',
      'mixed': 'mixto'
    }
    return methodMap[type] || 'efectivo'
  }

  // Crea un orden
  const createOrder = async () => {
    isLoading.value = true
    error.value = null

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
      const pedidoResult = await supabaseFetch<MainOrderDetails[]>('/pedidos', {
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
      error.value = errorMessage

      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  // Carga un pedido por su número
  const loadOrderByNumber = async (orderNumber: string) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('📦 Cargando pedido:', orderNumber)

      // 1. Obtener datos del pedido principal
      const orderDetails = await supabaseFetch<MainOrderDetails[]>(`/pedidos?numero_pedido=eq.${orderNumber}&select=*`)

      if (!orderDetails || orderDetails.length === 0) {
        throw new Error('Pedido no encontrado')
      }

      const firstOrder = orderDetails[0]!

      // 2. Obtener datos del usuario
      const usuarioData = await supabaseFetch<UserData[]>(`/usuarios?id=eq.${firstOrder.usuario_id}&select=telefono,nombre`)

      // 3. Obtener datos de la dirección
      const direccionData = await supabaseFetch<AddressSummary[]>(`/direcciones?id=eq.${firstOrder.direccion_id}&select=id,calle,numero_exterior,numero_interior,colonia,referencias`)

      // 3.5. Obtener datos del repartidor (si existe)
      let repartidorData = null
      if (firstOrder.repartidor_id) {
        repartidorData = await supabaseFetch<UserData[]>(`/usuarios?id=eq.${firstOrder.repartidor_id}&select=nombre,telefono`)
      }

      // 4. Obtener detalles del pedido (productos)
      const detallesData = await supabaseFetch<OrderProduct[]>(`/pedido_detalles?pedido_id=eq.${firstOrder.id}&select=producto_id,cantidad,precio_unitario,subtotal`)

      console.log('Detalles del pedido obtenidos:', detallesData)

      // 5. Obtener información de los productos
      const productos: OrderProductDetails[] = []

      if (detallesData && detallesData.length > 0) {
        for (const detalle of detallesData) {
          const productoData = await supabaseFetch<Array<{
            id: string
            nombre: string
            imagen_url: string
          }>>(`/productos?id=eq.${detalle.producto_id}&select=id,nombre,imagen_url`)

          if (productoData && productoData.length > 0) {
            const producto = productoData[0]!
            productos.push({
              id: producto.id,
              nombre: producto.nombre,
              imagen_url: producto.imagen_url,
              cantidad: detalle.cantidad,
              precio_unitario: detalle.precio_unitario,
              subtotal: detalle.subtotal
            })
          }
        }
      }

      // 6. Construir objeto de pedido completo
      order.value = {
        id: firstOrder.id,
        numero_pedido: firstOrder.numero_pedido,
        estado: firstOrder.estado,
        medio_pago: firstOrder.medio_pago,
        subtotal: firstOrder.subtotal,
        descuento: firstOrder.descuento,
        total: firstOrder.total,
        costo_envio: firstOrder.costo_envio,
        instrucciones_entrega: firstOrder.instrucciones_entrega,
        created_at: firstOrder.created_at,
        repartidor_id: firstOrder.repartidor_id as string,
        usuario: usuarioData && usuarioData[0] ? usuarioData[0] : { telefono: '', nombre: '' },
        direccion: direccionData && direccionData[0] ? direccionData[0] : {
          calle: '',
          numero_exterior: '',
          colonia: ''
        },
        repartidor: repartidorData && repartidorData[0] ? repartidorData[0] : undefined,
        productos
      }

      console.log('✅ Pedido cargado:', order.value)

      return order.value
    } catch (err: unknown) {
      console.error('❌ Error cargando pedido:', err)
      error.value = (err as Error)?.message || 'Error al cargar el pedido'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Carga los pedidos del usuario autenticado
  const loadUserOrders = async () => {
    if (!userId.value) {
      console.warn('No hay usuario autenticado')
      return
    }

    isLoading.value = true
    error.value = null

    try {
      console.log('📦 Cargando pedidos del usuario:', userId.value)

      // Obtener pedidos del usuario ordenados por fecha (más nuevos primero)
      const ordersData = await supabaseFetch<OrderSummary[]>(`/pedidos?usuario_id=eq.${userId.value}&select=id,numero_pedido,estado,total,created_at,direccion_id&order=created_at.desc`)

      if (!ordersData || ordersData.length === 0) {
        userOrders.value = []
        console.log('ℹ️ No se encontraron pedidos')
        return
      }

      // Para cada pedido, obtener información de la dirección
      const ordersWithAddress: OrderWithAddress[] = []

      for (const order of ordersData) {
        // Obtener dirección
        const addressData = await supabaseFetch<AddressSummary[]>(`/direcciones?id=eq.${order.direccion_id}&select=calle,numero_exterior`)

        ordersWithAddress.push({
          id: order.id,
          numero_pedido: order.numero_pedido,
          estado: order.estado,
          total: order.total,
          created_at: order.created_at,
          direccion: addressData && addressData[0] ? addressData[0] : {
            calle: 'Dirección no disponible',
            numero_exterior: '',
            colonia: '',
            numero_interior: '',
            referencias: '',
          }
        })
      }

      userOrders.value = ordersWithAddress
      console.log(`✅ ${userOrders.value.length} pedidos cargados`)
    } catch (err: any) {
      console.error('❌ Error cargando pedidos:', err)
      error.value = err?.message || 'Error al cargar los pedidos'
      userOrders.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    createOrder,
    loadOrderByNumber,
    loadUserOrders,
    // Consolidated state
    isLoading: readonly(isLoading),
    error: readonly(error),
    // Data
    order: readonly(order),
    userOrders: computed(() => userOrders.value)
  }
}
