import type { CartProduct } from "./product.interface";

export interface Cart {
  productos: CartProduct[];
  subtotal: number;
  costo_envio: number;
  total: number;
}