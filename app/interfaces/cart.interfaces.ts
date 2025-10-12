export interface CartProduct {
  id: string;
  nombre: string;
  imagen_url: string;
  cantidad: number;
  precio_unitario: number;
}

export interface Cart {
  productos: CartProduct[];
  subtotal: number;
  costo_envio: number;
  total: number;
}