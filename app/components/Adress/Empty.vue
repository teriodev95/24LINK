<template>
  <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-xl p-6">
    <div class="flex flex-col items-center text-center space-y-3">
      <!-- Icono de ubicación -->
      <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
        <LucideMapPin :size="32" class="text-[#001954]" />
      </div>

      <!-- Título -->
      <div>
        <h4 class="text-[#001954] font-semibold text-base mb-1">
          Necesitamos tu dirección de entrega
        </h4>
        <p class="text-gray-600 text-sm leading-relaxed">
          Agrega una dirección para calcular el costo de envío y completar tu pedido
        </p>
      </div>

      <!-- Botón de acción -->
      <NuxtLink to="/ubicacion"
        class="inline-flex items-center gap-2 bg-[#001954] text-white px-6 py-3 rounded-lg hover:bg-[#003d99] transition-colors duration-200 font-medium shadow-md hover:shadow-lg">
        <LucidePlus :size="18" />
        <span>Agregar dirección de entrega</span>
      </NuxtLink>

      <!-- Nota adicional -->
      <p class="text-xs text-gray-500 mt-2">
        Podrás guardar múltiples direcciones para tus próximas compras
      </p>
    </div>
  </div>
</template>