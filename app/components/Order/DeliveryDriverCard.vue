<script setup lang="ts">
interface Props {
  driverName: string
  driverPhone: string
  deliveryAddress: string
}

const props = defineProps<Props>()

const whatsappUrl = computed(() => {
  const cleanPhone = props.driverPhone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}`
})

const phoneUrl = computed(() => {
  return `tel:${props.driverPhone}`
})
</script>

<template>
  <section>
    <p class="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Repartidor</p>

    <div class="bg-gray-50/80 rounded-2xl p-4">
      <div class="flex gap-4">
        <!-- Info -->
        <div class="flex-1 space-y-3">
          <p class="text-[14px] font-semibold text-[#001954]">
            {{ driverName }} lleva tu pedido
          </p>

          <!-- Contact buttons -->
          <div class="flex gap-2">
            <a
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-xl bg-white flex items-center justify-center active:scale-95 transition-transform duration-150"
            >
              <Icon name="lucide:message-circle" size="18" class="text-[#001954]" />
            </a>
            <a
              :href="phoneUrl"
              class="w-10 h-10 rounded-xl bg-white flex items-center justify-center active:scale-95 transition-transform duration-150"
            >
              <Icon name="lucide:phone" size="18" class="text-[#001954]" />
            </a>
          </div>

          <p class="text-[11px] text-gray-400">
            Contáctalo solo si es necesario. Si no responde, puede estar manejando.
          </p>

          <!-- Delivery address -->
          <div class="flex items-center gap-2">
            <Icon name="lucide:map-pin" size="14" class="text-gray-400 shrink-0" />
            <p class="text-[12px] text-gray-500">{{ deliveryAddress }}</p>
          </div>
        </div>

        <!-- Image -->
        <div class="w-1/3 flex items-center justify-center">
          <img src="/images/moto.webp" alt="Motocicleta" class="w-full h-auto object-contain">
        </div>
      </div>
    </div>
  </section>
</template>
