
export interface Address {
  colony: string
  id: string
  reference?: string
  street: string
}

export interface SupabaseAdress {
  calle: string
  colonia: string
  id: string
  numero_exterior: string
  numero_interior?: string
  referencias?: string
}

export interface SaveAddressData {
  calle: string
  colonia: string
  latitud: number
  longitud: number
  numero_exterior: string
  referencias?: string
}


export interface PaymentMethod {
  description: string
  title: string
  type: Method
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

export interface CreateOrderResponse {
  id: string;
  usuario_id: string;
  direccion_id: string;
  repartidor_id: string | null;
  numero_pedido: string;
  estado: string;
  medio_pago: string;
  instrucciones_entrega: string;
  subtotal: number;
  descuento: number;
  total: number;
  notas: string | null;
  fecha_entrega: string | null;
  created_at: string;
  updated_at: string;
  costo_envio: number;
}