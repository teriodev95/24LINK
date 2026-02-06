<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

const productsStore = useProductsStore()

if (!productsStore.hasData && !productsStore.isLoading) {
  productsStore.fetchData()
}
useHead({
  link: [
    { rel: 'manifest', href: '/manifest.json' }
  ],
  meta: [
    { name: 'theme-color', content: '#001954' }
  ]
})
</script>

<template>
  <div class="pt-2 bg-[#FFFFFF] max-w-6xl mx-auto ">
    <Toaster position="top-center" />
    <NuxtPage />
    <ClientOnly>
      <UIInstallPrompt />
    </ClientOnly>
  </div>
</template>
