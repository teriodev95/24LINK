<template>
  <!-- Mensaje de alerta cuando no hay dirección -->
  <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <div class="flex items-start gap-3">
      <LucideAlertCircle :size="20" class="text-yellow-600 flex-shrink-0 mt-0.5" />
      <div>
        <p class="text-primary font-semibold text-sm">
          Necesitas agregar una dirección de entrega
        </p>
        <p class="text-secondary text-sm mt-1">
          Agrega tu dirección en la sección de contacto para poder realizar tu pedido
        </p>
      </div>
    </div>
  </div>
</template>