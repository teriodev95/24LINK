<script setup lang="ts">
import formatCurrency from '~/utils/formatCurrency'

const route = useRoute()
const cartStore = useCartStore()
const { isAuthenticated } = useAuth()

const hasItems = computed(() => cartStore.totalItems > 0)

const cartLabel = computed(() => {
  const count = cartStore.totalItems
  return count === 1 ? '1 Producto' : `${count} Productos`
})

const checkoutUrl = computed(() =>
  isAuthenticated.value ? '/detalles-orden' : '/verificacion'
)

const tabs = [
  { label: 'Tienda', icon: 'lucide:store', to: '/' },
  { label: 'Pasillos', icon: 'lucide:layout-grid', to: '/pasillos' },
  { label: 'Pedidos', icon: 'lucide:clock', to: '/pedidos' },
  { label: 'Perfil', icon: 'lucide:user', to: '/perfil' },
]

const isActiveTab = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

const handleTabClick = (to: string) => {
  if (to === '/pedidos' || to === '/perfil') {
    if (!isAuthenticated.value) {
      navigateTo('/verificacion')
      return
    }
  }
  navigateTo(to)
}
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)]">
    <!-- Fade backdrop -->
    <div class="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />

    <div class="relative">
      <!-- Cart Pill -->
      <div v-if="hasItems" class="flex justify-center px-5 mb-2.5">
        <NuxtLink
          :to="checkoutUrl"
          class="bg-[#001954] text-white rounded-full px-5 h-11 inline-flex items-center gap-2.5 shadow-[0_4px_20px_rgba(0,25,84,0.3)] active:scale-[0.97] transition-transform duration-150"
        >
          <span class="text-[13px] font-semibold">{{ cartLabel }}</span>
          <span class="text-white/25">|</span>
          <Icon name="lucide:shopping-cart" size="15" />
          <span class="text-white/25">|</span>
          <span class="text-[13px] font-semibold">MXN {{ formatCurrency(cartStore.cart.subtotal) }}</span>
        </NuxtLink>
      </div>

      <!-- Navigation bar -->
      <div class="flex items-stretch gap-2.5 px-5 pb-4">
        <!-- Tab Bar -->
        <div class="flex-1 bg-white rounded-[22px] shadow-[0_2px_20px_rgba(0,0,0,0.08)] flex items-center justify-around h-[56px]">
          <button
            v-for="tab in tabs"
            :key="tab.to"
            class="flex flex-col items-center justify-center gap-[3px] flex-1 h-full cursor-pointer transition-colors duration-150"
            :class="isActiveTab(tab.to) ? 'text-[#001954]' : 'text-gray-300'"
            @click="handleTabClick(tab.to)"
          >
            <Icon :name="tab.icon" size="21" />
            <span
              class="text-[10px] leading-none"
              :class="isActiveTab(tab.to) ? 'font-bold' : 'font-medium'"
            >
              {{ tab.label }}
            </span>
          </button>
        </div>

        <!-- Search Button -->
        <NuxtLink
          to="/buscar"
          class="w-[56px] h-[56px] bg-white rounded-[22px] shadow-[0_2px_20px_rgba(0,0,0,0.08)] flex items-center justify-center shrink-0 active:scale-[0.93] transition-transform duration-150"
        >
          <Icon name="lucide:search" size="21" class="text-[#001954]" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
