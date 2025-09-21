<script setup lang="ts">
interface Props {
  modelValue: string;
}

const props = defineProps<Props>();
defineEmits<{
  'update:modelValue': [value: string];
}>();
const hasSearchQuery = computed(() => props.modelValue.length > 0);

</script>

<template>
  <section class="relative">
    <input :value="modelValue" type="text" placeholder="Busca en 24HrsFiesta"
      class="w-full rounded-3xl text-center border border-[#1F2020] py-3 px-6 pr-12"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
    <lucide-search v-if="!hasSearchQuery"
      class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />

    <lucide-x v-else class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer"
      @click="$emit('update:modelValue', '')" />
  </section>
</template>
