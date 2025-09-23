<template>
  <main class="p-2 space-y-4">
    <nav class="flex justify-between justify-center gap-2">
      <NuxtLink to="/">
        <LucideChevronLeft />
      </NuxtLink>
      <button>Volver</button>
      <span />
    </nav>

    <OrderContactCard />
    <OrderPaymentCard />
    <OrderProductList />
    <OrderDetailsCard />
    <UIButtonAction label="Ordenar" type="link" to="/" class-name="w-full" />
  </main>
</template>

<script setup lang="ts">
</script>

<style scoped></style>