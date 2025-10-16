<script setup lang="ts">

interface Emits {
  navigateToProducts: []
  openStoreLocation: []
}

defineEmits<Emits>()
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center shadow-xl">
      <p class="text-4xl mb-4">😴</p>

      <h2 class="text-xl font-bold text-gray-900 mb-4">
        Por ahora estamos en pausa 💤
      </h2>

      <p class="text-gray-600 mb-6 leading-relaxed whitespace-pre-line">
        Hola 👋, una disculpa, a esta hora todavía no andamos repartiendo pedidos.

        ¡Pero no te preocupes! Puedes visitarnos en nuestro local físico o seguir explorando nuestros productos.
      </p>

      <div class="space-y-3">
        <!-- Primary Button -->
        <button
          class="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          @click="$emit('navigateToProducts')">
          Ver productos
        </button>

        <!-- Secondary Button -->
        <button
          class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          @click="$emit('openStoreLocation')">
          Ir al local
        </button>
      </div>
    </div>
  </div>
</template>