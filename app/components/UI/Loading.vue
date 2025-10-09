<script setup lang="ts">
interface Props {
  size?: number
}

withDefaults(defineProps<Props>(), {
  size: 100
})
</script>

<template>
  <div class="flex justify-center items-center">
    <DotLottieVue
      :src="'/loading-24link.lottie'"
      :width="size"
      :height="size"
      autoplay
      loop
    />
  </div>
</template>
