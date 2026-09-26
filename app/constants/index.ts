export const STORE_LOCATION = {
  lat: 19.735471,
  lng: -101.198988
} as const;

export const TEST_DEFAULT_CENTER = {
  lat: 19.701335,
  lng: -101.190223
} as const;

export const appVersion = '1.2.2';

// Verificación por OTP (WhatsApp) pausada: se usa registro simple con nombre + teléfono.
// Cambiar a true para reactivar el flujo de PIN.
export const OTP_VERIFICATION_ENABLED = false;
