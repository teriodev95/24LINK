<script setup lang="ts">
interface Props {
  id: string
  label: string
  modelValue: string
  type?: string
  placeholder?: string
  required?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-2">
    <label :for="id" class="text-secondary">{{ label }}</label>
    <input :id="id" :type="type" :placeholder="placeholder"
      class="w-full p-2 bg-[#F9F9F9] border border-gray-300 rounded py-4 px-[18px]">
  </div>
</template>
