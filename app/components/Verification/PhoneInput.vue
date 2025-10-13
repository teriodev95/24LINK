<script setup lang="ts">
interface Props {
  modelValue: string
  error?: string
  isVerified?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="relative">
    <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
      +52
    </div>
    <input v-model="inputValue" type="tel" maxlength="10" placeholder="4431234567"
      class="w-full pl-16 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-[#001954] focus:outline-none transition-all duration-200"
      :class="{
        'border-red-500': error,
        'border-green-500': isVerified
      }">
  </div>
</template>