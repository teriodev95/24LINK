
export interface Address {
  id: string
  street: string
  colony: string
}

export interface PaymentMethod {
  type: Method
  title: string
  description: string
}

export interface DeliveryMethod {
  type: string
  title: string
}

type Method = 'card' | 'cash' | 'mixed'
export type OrderStatus = 'nuevo' | 'aceptado' | 'en_ruta' | 'completado' | 'cancelado';

export interface AddressSummary {
  calle: string
  numero_exterior: string
} 

export interface RecentOrder {
  id: string
  numero_pedido: string
  estado: OrderStatus
  total: number
  created_at: string
  direccion_id: string
}

export interface Order {
  id: string
  numero_pedido: string
  estado: OrderStatus
  total: number
  created_at: string
  direccion: AddressSummary
}