import type { AddressSummary } from "./adress.interface";
import type { OrderProductDetails } from "./product.interface";

type Method = 'card' | 'cash' | 'mixed'
export type OrderStatus = 'nuevo' | 'aceptado' | 'en_ruta' | 'completado' | 'cancelado';

export interface PaymentMethod {
  description: string
  title: string
  type: Method
}

export interface DeliveryMethod {
  type: string
  title: string
}

export interface OrderSummary {
  id: string
  numero_pedido: string
  estado: OrderStatus
  total: number
  created_at: string
  direccion_id: string
}

export interface OrderWithAddress {
  id: string
  numero_pedido: string
  estado: OrderStatus
  total: number
  created_at: string
  direccion: AddressSummary
}

export interface MainOrderDetails {
  costo_envio: number;
  created_at: string;
  descuento: number;
  direccion_id: string;
  estado: OrderStatus;
  fecha_entrega: string | null;
  id: string;
  instrucciones_entrega: string;
  medio_pago: string;
  notas: string | null;
  numero_pedido: string;
  repartidor_id: string | null;
  subtotal: number;
  total: number;
  updated_at: string;
  usuario_id: string;
}

export interface FullOrderDetails  {
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
  direccion: AddressSummary,
  repartidor?: {
    nombre: string
    telefono: string
  }
  productos: OrderProductDetails[]
}