<template>
  <div class="bg-gray-50/80 rounded-2xl p-5">
    <div class="flex flex-col items-center text-center space-y-3">
      <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
        <Icon name="lucide:map-pin" size="22" class="text-[#001954]" />
      </div>

      <div>
        <p class="text-[13px] font-semibold text-[#001954] mb-0.5">
          Necesitamos tu dirección de entrega
        </p>
        <p class="text-[11px] text-gray-400 leading-relaxed">
          Agrega una dirección para calcular el costo de envío
        </p>
      </div>

      <NuxtLink
        to="/ubicacion"
        class="inline-flex items-center gap-2 bg-[#001954] text-white px-5 h-10 rounded-2xl text-[13px] font-semibold transition-all duration-150 active:scale-[0.97] shadow-[0_4px_20px_rgba(0,25,84,0.3)]"
      >
        <Icon name="lucide:plus" size="16" />
        <span>Agregar dirección</span>
      </NuxtLink>
    </div>
  </div>
</template>
