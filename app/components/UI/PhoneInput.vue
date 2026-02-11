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
    <label for="phone" class="text-[13px] font-bold text-gray-500 flex items-center gap-2">
      <Icon name="lucide:smartphone" size="14" />
      Teléfono celular
    </label>
    
    <div class="relative group">
      <!-- Input Field -->
      <input
        id="phone"
        type="tel"
        :value="phone"
        :readonly="readonly"
        :disabled="disabled"
        class="block w-full h-12 rounded-xl bg-gray-50 border border-gray-100 text-[14px] font-medium text-[#001954] placeholder-gray-400 px-4 pr-10 outline-none transition-all duration-200 cursor-not-allowed uppercase tracking-wide opacity-80"
      >
      
      <!-- Lock Icon -->
      <div class="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
        <Icon name="lucide:lock" size="14" class="text-gray-400 opacity-60" />
      </div>
    </div>
    
    <p class="text-[11px] font-medium text-gray-400 px-1 leading-snug">
      Este es el teléfono con el que iniciaste sesión.
    </p>
  </div>
</template>
