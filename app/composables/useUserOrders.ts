import type { Order, RecentOrder } from "~/interfaces"


export function useUserOrders() {
  const { $fetch: supabaseFetch } = useSupabaseApi()
  const { userId } = useAuth()

  const orders = ref<Order[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

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
      const pedidosData = await supabaseFetch<RecentOrder[]>(`/pedidos?usuario_id=eq.${userId.value}&select=id,numero_pedido,estado,total,created_at,direccion_id&order=created_at.desc`)

      if (!pedidosData || pedidosData.length === 0) {
        orders.value = []
        console.log('ℹ️ No se encontraron pedidos')
        return
      }

      // Para cada pedido, obtener información de la dirección
      const ordersWithAddress: Order[] = []

      for (const pedido of pedidosData) {
        // Obtener dirección
        const direccionData = await supabaseFetch<Array<{
          calle: string
          numero_exterior: string
        }>>(`/direcciones?id=eq.${pedido.direccion_id}&select=calle,numero_exterior`)

        ordersWithAddress.push({
          id: pedido.id,
          numero_pedido: pedido.numero_pedido,
          estado: pedido.estado,
          total: pedido.total,
          created_at: pedido.created_at,
          direccion: direccionData && direccionData[0] ? direccionData[0] : {
            calle: 'Dirección no disponible',
            numero_exterior: ''
          }
        })
      }

      orders.value = ordersWithAddress
      console.log(`✅ ${orders.value.length} pedidos cargados`)
    } catch (err: any) {
      console.error('❌ Error cargando pedidos:', err)
      error.value = err?.message || 'Error al cargar los pedidos'
      orders.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Auto-cargar cuando cambia el userId
  watch(userId, (newUserId) => {
    if (newUserId) {
      loadUserOrders()
    } else {
      orders.value = []
    }
  }, { immediate: true })

  return {
    orders: computed(() => orders.value),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadUserOrders
  }
}
