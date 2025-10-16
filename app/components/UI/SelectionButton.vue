<script setup lang="ts">
interface Props {
  item: { title: string; description?: string }
  isSelected: boolean
  customClass?: string
}

defineProps<Props>()
defineEmits<{ select: [item: { title: string; description?: string }] }>()
</script>

<template>
  <button class="p-2 text-left rounded-lg space-y-1 drop-shadow-lg"
    :class="[isSelected ? 'bg-[#CCD1DD]' : 'bg-white', customClass]" @click="$emit('select', item)">
    <p class="text-sm font-bold text-[#001954]">{{ item.title }}</p>
    <p v-if="item.description" class="text-xs font-normal text-[#001954]">
      {{ item.description }}
    </p>
  </button>
</template>