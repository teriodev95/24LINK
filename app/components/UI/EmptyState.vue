<script setup lang="ts">
interface Props {
  message?: string;
}

withDefaults(defineProps<Props>(), {
  message: 'No se encontraron productos'
});
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-2 py-8 text-gray-500">
    <slot name="icon" />
    <p>{{ message }}</p>
  </div>
</template>