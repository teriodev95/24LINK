<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  helperText?: string
}

withDefaults(defineProps<Props>(), {
  label: 'Télefono Celular',
  helperText: 'Este es el teléfono con el que iniciaste sesión'
})
</script>

<template>
  <div class="space-y-2">
    <label for="phone" class="text-secondary">{{ label }} 📱</label>
    <div class="relative">
      <input id="phone" type="tel" :value="modelValue" readonly disabled
        class="w-full p-2 border border-gray-300 rounded py-4 px-[18px] bg-gray-100 text-gray-700 cursor-not-allowed">
      <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <LucideLock :size="16" class="text-gray-400" />
      </div>
    </div>
    <p class="text-xs text-gray-500">{{ helperText }}</p>
  </div>
</template>