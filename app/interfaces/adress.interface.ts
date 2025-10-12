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

export interface AddressSummary {
  calle: string
  numero_exterior: string
  colonia: string
  numero_interior?: string
  referencias?: string
}