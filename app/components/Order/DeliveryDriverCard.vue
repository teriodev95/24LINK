<script setup lang="ts">
interface Props {
  driverName: string
  driverPhone: string
  deliveryAddress: string
}

const props = defineProps<Props>()

// Generar URL de WhatsApp
const whatsappUrl = computed(() => {
  const cleanPhone = props.driverPhone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}`
})

// Generar URL de llamada telefónica
const phoneUrl = computed(() => {
  return `tel:${props.driverPhone}`
})
</script>

<template>
  <UISection>
    <div class="flex gap-4">
      <!-- Columna izquierda (2/3) -->
      <div class="flex-1 space-y-3">
        <!-- Descripción -->
        <p class="text-primary font-semibold">
          {{ driverName }} lleva tu pedido
        </p>

        <!-- Botones de contacto -->
        <div class="flex gap-2">
          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="border border-[#E6E6E6] rounded-lg p-2 flex items-center justify-center hover:bg-[#F9F9F9] transition-colors"
          >
            <LucideMessageCircle :size="20" class="text-primary" />
          </a>
          <a
            :href="phoneUrl"
            class="border border-[#E6E6E6] rounded-lg p-2 flex items-center justify-center hover:bg-[#F9F9F9] transition-colors"
          >
            <LucidePhone :size="20" class="text-primary" />
          </a>
        </div>

        <!-- Nota informativa -->
        <p class="text-xs text-[#717272]">
          Contáctalo solo si es necesario. Si no responde, puede estar manejando.
        </p>

        <!-- Dirección de entrega -->
        <div class="flex items-start gap-2">
          <LucideArrowRight :size="20" class="text-primary flex-shrink-0" />
          <p class="text-secondary text-sm">{{ deliveryAddress }}</p>
        </div>
      </div>

      <!-- Columna derecha (1/3) - Imagen -->
      <div class="w-1/3 flex items-center justify-center">
        <img src="/images/moto.webp" alt="Motocicleta" class="w-full h-auto object-contain">
      </div>
    </div>
  </UISection>
</template>
