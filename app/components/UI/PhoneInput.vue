<script setup lang="ts">
interface Props {
  phone: string
  readonly?: boolean
  disabled?: boolean
}



withDefaults(defineProps<Props>(), {
  readonly: false,
  disabled: false,
})
</script>

<template>
  <div class="space-y-2">
    <label for="phone" class="text-secondary">Télefono Celular 📱</label>
    <div class="relative">
      <input id="phone" type="tel" :value="phone" :readonly="readonly" :disabled="disabled"
        class="w-full p-2 border border-gray-300 rounded py-4 px-[18px] bg-gray-100 text-gray-700 cursor-not-allowed">
      <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <LucideLock :size="16" class="text-gray-400" />
      </div>
    </div>
    <p class="text-xs text-gray-500">Este es el teléfono con el que iniciaste sesión</p>
  </div>
</template>