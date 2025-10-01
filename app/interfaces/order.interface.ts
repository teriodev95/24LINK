import type { CartProduct } from "./cart.interfaces"

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
type OrderStatus = 'creado' | 'confirmado' | 'en_ruta' | 'entregado';

export interface Order {
  id: string;
  estado: OrderStatus;
  fecha: string;
  productos: CartProduct[];
  total: number;
  subtotal: number;
  costo_envio: number;
  metodo_pago: Method;
}