<template>
  <Transition name="slide-up">
    <div
      v-if="show"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t-2 border-[#001954] shadow-2xl max-w-6xl mx-auto"
    >
      <div class="flex items-start justify-between gap-4">
        <!-- Content -->
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <img :src="appIcon" :alt="appName" class="w-12 h-12 rounded-lg">
            <div>
              <h3 class="text-primary font-bold text-lg">{{ title }}</h3>
              <p class="text-secondary text-sm">{{ description }}</p>
            </div>
          </div>
        </div>

        <!-- Close button -->
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
          :aria-label="closeLabel"
        >
          <LucideX :size="20" />
        </button>
      </div>

      <!-- Action buttons -->
      <div class="mt-4 flex gap-2">
        <button
          @click="$emit('install')"
          :disabled="installing"
          class="flex-1 bg-[#001954] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#002066] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="installing">{{ installingText }}</span>
          <span v-else>{{ installText }}</span>
        </button>
        <button
          @click="$emit('dismiss')"
          :disabled="installing"
          class="px-6 py-3 text-secondary hover:text-primary transition-colors disabled:opacity-50"
        >
          {{ dismissText }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  installing?: boolean
  appIcon?: string
  appName?: string
  title?: string
  description?: string
  installText?: string
  installingText?: string
  dismissText?: string
  closeLabel?: string
}

withDefaults(defineProps<Props>(), {
  installing: false,
  appIcon: '/images/icono-24link.png',
  appName: '24Link',
  title: 'Descarga 24Link',
  description: 'Instala la app para un acceso más rápido y directo',
  installText: 'Instalar ahora',
  installingText: 'Instalando...',
  dismissText: 'Más tarde',
  closeLabel: 'Cerrar'
})

defineEmits<{
  install: []
  dismiss: []
  close: []
}>()
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>