<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

const productsStore = useProductsStore()

if (!productsStore.hasData && !productsStore.isLoading) {
  productsStore.fetchData()
}

useProductRefresh()
useHead({
  link: [
    { rel: 'manifest', href: '/manifest.json' },
    { rel: 'apple-touch-icon', href: '/images/icono-24link.png' }
  ],
  meta: [
    { name: 'theme-color', content: '#001954' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title', content: '24Link' }
  ],
  script: [
    {
      innerHTML: `
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.addEventListener('controllerchange', function() {
            window.location.reload();
          });
        }
      `,
      tagPosition: 'head'
    }
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
