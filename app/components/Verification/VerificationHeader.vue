<script setup lang="ts">
interface Props {
  type: 'phone' | 'pin'
}

defineProps<Props>()

const headerData = computed(() => ({
  phone: {
    icon: 'LucideSmartphone',
    title: 'Verificar teléfono',
    subtitle: 'Ingresa tu número de teléfono para recibir un código'
  },
  pin: {
    icon: 'LucideShieldCheck',
    title: 'Código de verificación',
    subtitle: 'Ingresa el código de 4 dígitos enviado a tu WhatsApp'
  }
}))
</script>

<template>
  <div class="text-center space-y-8">
    <!-- Icono con animación -->
    <div class="flex justify-center">
      <div class="relative">
        <!-- Círculo de fondo animado -->
        <div class="absolute inset-0 bg-[#001954] opacity-10 rounded-full animate-ping" />
        <div class="relative bg-[#001954] bg-opacity-10 p-4 rounded-full">
          <LucideSmartphone v-if="type === 'phone'" :size="40" class="text-[#001954]" />
          <LucideShieldCheck v-else :size="40" class="text-[#001954]" />
        </div>
      </div>
    </div>

    <!-- Título -->
    <div class="space-y-2">
      <h1 class="text-3xl font-bold text-[#001954]">
        {{ headerData[type].title }}
      </h1>
      <p class="text-gray-600 text-sm">
        {{ headerData[type].subtitle }}
      </p>
    </div>
  </div>
</template>