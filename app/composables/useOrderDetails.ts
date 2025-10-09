import type { OrderStatus } from '~/interfaces/order.interface'

interface OrderProduct {
  id: string
  nombre: string
  imagen_url: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

interface OrderData {
  id: string
  numero_pedido: string
  estado: OrderStatus
  medio_pago: string
  subtotal: number
  descuento: number
  total: number
  costo_envio: number
  instrucciones_entrega: string
  created_at: string
  repartidor_id?: string
  usuario: {
    telefono: string
    nombre: string
  }
  direccion: {
    calle: string
    numero_exterior: string
    numero_interior?: string
    colonia: string
    referencias?: string
  }
  repartidor?: {
    nombre: string
    telefono: string
  }
  productos: OrderProduct[]
}

export function useOrderDetails() {
  const { $fetch: supabaseFetch } = useSupabaseApi()

  const order = ref<OrderData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadOrderByNumber = async (orderNumber: string) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('📦 Cargando pedido:', orderNumber)

      // 1. Obtener datos del pedido principal
      const pedidoData = await supabaseFetch<Array<{
        id: string
        numero_pedido: string
        estado: string
        medio_pago: string
        subtotal: number
        descuento: number
        total: number
        costo_envio: number
        instrucciones_entrega: string
        created_at: string
        usuario_id: string
        direccion_id: string
        repartidor_id?: string
      }>>(`/pedidos?numero_pedido=eq.${orderNumber}&select=*`)

      if (!pedidoData || pedidoData.length === 0) {
        throw new Error('Pedido no encontrado')
      }

      const pedido = pedidoData[0]!

      // 2. Obtener datos del usuario
      const usuarioData = await supabaseFetch<Array<{
        telefono: string
        nombre: string
      }>>(`/usuarios?id=eq.${pedido.usuario_id}&select=telefono,nombre`)

      // 3. Obtener datos de la dirección
      const direccionData = await supabaseFetch<Array<{
        calle: string
        numero_exterior: string
        numero_interior?: string
        colonia: string
        referencias?: string
      }>>(`/direcciones?id=eq.${pedido.direccion_id}&select=calle,numero_exterior,numero_interior,colonia,referencias`)

      // 3.5. Obtener datos del repartidor (si existe)
      let repartidorData = null
      if (pedido.repartidor_id) {
        repartidorData = await supabaseFetch<Array<{
          nombre: string
          telefono: string
        }>>(`/usuarios?id=eq.${pedido.repartidor_id}&select=nombre,telefono`)
      }

      // 4. Obtener detalles del pedido (productos)
      const detallesData = await supabaseFetch<Array<{
        producto_id: string
        cantidad: number
        precio_unitario: number
        subtotal: number
      }>>(`/pedido_detalles?pedido_id=eq.${pedido.id}&select=producto_id,cantidad,precio_unitario,subtotal`)

      // 5. Obtener información de los productos
      const productos: OrderProduct[] = []

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
        id: pedido.id,
        numero_pedido: pedido.numero_pedido,
        estado: pedido.estado,
        medio_pago: pedido.medio_pago,
        subtotal: pedido.subtotal,
        descuento: pedido.descuento,
        total: pedido.total,
        costo_envio: pedido.costo_envio,
        instrucciones_entrega: pedido.instrucciones_entrega,
        created_at: pedido.created_at,
        repartidor_id: pedido.repartidor_id,
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
    } catch (err: any) {
      console.error('❌ Error cargando pedido:', err)
      error.value = err?.message || 'Error al cargar el pedido'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    order: readonly(order),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadOrderByNumber
  }
}
