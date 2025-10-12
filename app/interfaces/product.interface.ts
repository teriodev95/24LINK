export interface Product {
  id: string;
  categoria_id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  porcentaje_descuento: number;
  imagen_url: string;
  stock: number;
  activo: boolean;
  created_at: string; 
  updated_at: string; 
}

export interface Category {
  id: string;
  nombre: string;
}

export interface CartProduct {
  id: string;
  nombre: string;
  imagen_url: string;
  cantidad: number;
  precio_unitario: number;
}

export interface OrderProductDetails extends CartProduct {
  subtotal: number
}

export interface OrderProduct {
  producto_id: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}