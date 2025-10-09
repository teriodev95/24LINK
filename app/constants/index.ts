import type { Order } from "~/interfaces";

// Ubicaciones
export const STORE_LOCATION = {
  lat: 19.735471,
  lng: -101.198988
} as const;

export const TEST_DEFAULT_CENTER = {
  lat: 19.701335,
  lng: -101.190223
} as const;

export const mockOrder: Order = {
  id: "ORD-12346",
  estado: "cancelado",
  fecha: "2025-10-01T15:30:00Z",

  productos: [
    {
      id: "PROD-0017",
      nombre: "Cerveza Victoria Mega Botella 1.2L",
      imagen_url: "https://db.el24.cc/storage/v1/object/public/images/productos/1756608063738-producto-2025-08-31T02-40-25-631Z.png",
      cantidad: 2,
      precio_unitario: 59.00
    },
    {
      id: "PROD-0022",
      nombre: "Nachos De Queso Y Chile Sabritas Doritos 76g",
      imagen_url: "https://db.el24.cc/storage/v1/object/public/images/productos/1756616706046-producto-2025-08-31T05-04-24-142Z.png",
      cantidad: 3,
      precio_unitario: 10.00
    },
    {
      id: "PROD-0009",
      nombre: "Tequila Maestro Dobel Diamante 700 ml",
      imagen_url: "https://db.el24.cc/storage/v1/object/public/images/productos/1756446161589-191687-1200-auto.webp",
      cantidad: 1,
      precio_unitario: 400.00
    }
  ],

  subtotal: 548.00,
  costo_envio: 35.00,
  total: 583.00,
  metodo_pago: "mixed",
} as const;