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
  productos: Product[];
  total: number;
  subtotal: number;
  costo_envio: number;
  metodo_pago: Method;
}

interface Product {
  id?: string;
  nombre: string;
  imagen_url: string;
  cantidad: number;
  precio_unitario: number;
}