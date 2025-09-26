<script setup lang="ts">
interface Props {
  id: string
  label: string
  modelValue: string
  disabled?: boolean
  placeholder?: string
  required?: boolean
  secondaryLabel?: string
  type?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

withDefaults(defineProps<Props>(), {
  placeholder: '',
  required: true,
  secondaryLabel: '',
  type: 'text',
  disabled: false,
})
defineEmits<Emits>()
</script>

<template>
  <div class="space-y-2">
    <label :for="id" class="text-label flex flex-col gap-1">
      <span>{{ label }}</span>
      <span v-if="secondaryLabel" class="text-label-secondary">{{ secondaryLabel }}</span>
    </label>
    <input :id="id" :type="type" :value="modelValue" :placeholder="placeholder" :required="required"
      :disabled="disabled" class="w-full p-2 bg-[#F9F9F9] border border-gray-300 rounded py-4 px-[18px]"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }" @input="$emit('update:modelValue', $event.target.value)">
  </div>
</template>
