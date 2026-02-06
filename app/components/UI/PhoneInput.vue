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
    <label for="phone" class="text-[13px] font-medium text-gray-500">Teléfono celular</label>
    <div class="relative">
      <input
        id="phone"
        type="tel"
        :value="phone"
        :readonly="readonly"
        :disabled="disabled"
        class="w-full h-12 bg-gray-50/80 rounded-2xl px-4 pr-10 text-[13px] text-gray-700 cursor-not-allowed outline-none"
      >
      <div class="absolute right-3.5 top-1/2 -translate-y-1/2">
        <Icon name="lucide:lock" size="15" class="text-gray-300" />
      </div>
    </div>
    <p class="text-[11px] text-gray-400 px-1">Este es el teléfono con el que iniciaste sesión</p>
  </div>
</template>
