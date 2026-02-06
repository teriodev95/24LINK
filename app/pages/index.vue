<script setup lang="ts">
const productsStore = useProductsStore()
const { isAuthenticated } = useAuth()
const { userOrders: orders, isLoading: isLoadingOrders, loadUserOrders } = useOrderApi()
const {
  isModalVisible,
  navigateToProducts,
  openStoreLocation,
} = useStoreStatus()

await productsStore.fetchData()
await loadUserOrders()

useSeoMeta({
  title: "24 Horas de Fiesta - Servicio 24/7 de Bebidas y Botanas a Domicilio",
  description: "¡La fiesta no para! Servicio de entrega 24 horas de bebidas alcohólicas, cerveza, tequila, vodka, brandy, botanas y todo lo esencial para tu fiesta. Entrega rápida y segura en Morelia.",
  keywords: "bebidas domicilio 24 horas, cerveza domicilio, tequila entrega, vodka delivery, brandy a domicilio, botanas fiesta, bebidas alcohólicas 24/7, servicio nocturno Morelia, delivery alcohol",
  author: "24 Horas de Fiesta",

  // Open Graph
  ogTitle: "24 Horas de Fiesta - Todo para tu Fiesta las 24 Horas",
  ogDescription: "Cerveza, tequila, vodka, brandy, botanas y más. Servicio de entrega 24/7 para que tu fiesta nunca pare. ¡Pide ahora!",
  ogType: "website",
  ogUrl: "https://24link.pages.dev/",
  ogImage: "./images/icono-24link.png",
  ogSiteName: "24 Horas de Fiesta",

  // Twitter Card
  twitterCard: "summary_large_image",
  twitterTitle: "24 Horas de Fiesta - Delivery 24/7",
  twitterDescription: "Bebidas y botanas a domicilio las 24 horas. Corona, José Cuervo, Absolut, Doritos y más. ¡La fiesta no para!",
  twitterImage: "./images/icono-24link.png",

  // Structured data hints for search engines
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
});
</script>

<template>
  <main>
    <div class="min-h-screen relative pb-36">
      <!-- Store Status Modal -->
      <ClientOnly>
        <UIStoreStatusModal v-if="isModalVisible" @navigate-to-products="navigateToProducts"
          @open-store-location="openStoreLocation" />
      </ClientOnly>

      <!-- Orders list -->
      <ClientOnly>
        <OrderList v-if="isAuthenticated" :orders="orders" :is-loading="isLoadingOrders" />
      </ClientOnly>

      <!-- Loading state -->
      <div v-if="productsStore.isLoading" class="flex justify-center items-center py-8"
        :class="{ 'pt-14': isAuthenticated && (orders.length > 0 || isLoadingOrders) }">
        <UILoading :size="120" />
      </div>
      <!-- Error state -->
      <div v-else-if="productsStore.error" class="flex justify-center items-center py-8"
        :class="{ 'pt-14': isAuthenticated && (orders.length > 0 || isLoadingOrders) }">
        <span class="text-red-500">{{ productsStore.error }}</span>
      </div>

      <!-- Main content when data is available -->
      <div v-else-if="productsStore.hasData"
        :class="{ 'pt-14': isAuthenticated && (orders.length > 0 || isLoadingOrders) }">

        <!-- Header -->
        <div class="px-5 pt-2 pb-1">
          <h1 class="text-[20px] font-bold text-[#001954] leading-tight">Tienda</h1>
          <p class="text-[12px] text-gray-400 mt-0.5">Entrega 24/7 en Morelia</p>
        </div>

        <!-- Category filter -->
        <CategoryFilter :category-list="productsStore.categories" :selected-category="productsStore.selectedCategory" />

        <!-- Unified product list component -->
        <div class="mt-4">
          <ProductList v-if="productsStore.shouldShowAllProducts || productsStore.shouldShowFilteredProducts" />

          <!-- No category selected state -->
          <div v-else class="flex justify-center items-center py-8">
            <span class="text-[13px] text-gray-400">Selecciona una categoría para ver los productos</span>
          </div>
        </div>
      </div>
    </div>

    <UIBottomNav />
  </main>
</template>
