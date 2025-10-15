/**
 * Calcula el costo de envío basado en la distancia y duración
 * Fórmula: Costo total = BASE + (PER_KM × km) + (PER_MINUTE × min)
 */
export interface DeliveryPricing {
  baseCost: number
  distanceCost: number
  timeCost: number
  totalCost: number
  formatted: string
}

export const calculateDeliveryCost = (
  distanceInMeters: number,
  durationInSeconds: number
): DeliveryPricing => {
  const config = useRuntimeConfig()

  // Convertir metros a kilómetros
  const distanceInKm = distanceInMeters / 1000

  // Convertir segundos a minutos
  const durationInMinutes = durationInSeconds / 60

  // Obtener configuración de precios
  const baseCost = config.public.deliveryBaseCost as number
  const costPerKm = config.public.deliveryCostPerKm as number
  const costPerMinute = config.public.deliveryCostPerMinute as number

  // Calcular costos
  const distanceCost = distanceInKm * costPerKm
  const timeCost = durationInMinutes * costPerMinute
  const totalCost = baseCost + distanceCost + timeCost

  return {
    baseCost,
    distanceCost,
    timeCost,
    totalCost: Math.round(totalCost * 100) / 100, // Redondear a 2 decimales
    formatted: `$${Math.round(totalCost)} MXN`
  }
}