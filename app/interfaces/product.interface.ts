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
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}