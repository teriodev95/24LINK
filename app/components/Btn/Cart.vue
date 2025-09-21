<script setup lang="ts">
const cartStore = useCartStore()

const hasItems = computed(() => cartStore.totalItems > 0)
const label = computed(() => {
  const count = cartStore.totalItems
  return count === 1 ? '1 Producto' : `${count} Productos`
})

</script>

<template>
  <button v-if="hasItems"
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#001954] rounded-3xl w-44 h-12 text-white ">
    {{ label }}
  </button>
</template>
