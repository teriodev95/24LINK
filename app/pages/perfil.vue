<script setup lang="ts">
const { isAuthenticated, user, logout, userPhone } = useAuth()

onMounted(() => {
  if (!isAuthenticated.value) {
    navigateTo('/verificacion')
  }
})

const handleLogout = () => {
  // Add a confirmation or just logout
  const confirmed = confirm('¿Estás seguro que deseas cerrar sesión?')
  if (confirmed) {
    logout()
    navigateTo('/')
  }
}

const menuItems = [
  { icon: 'lucide:map-pin', label: 'Mis Direcciones', to: '/ubicacion', color: 'text-amber-500', bg: 'bg-amber-50' },
  { icon: 'lucide:credit-card', label: 'Métodos de Pago', to: '#', color: 'text-emerald-500', bg: 'bg-emerald-50', disabled: true }, // Placeholder
  { icon: 'lucide:help-circle', label: 'Ayuda y Soporte', to: '#', color: 'text-blue-500', bg: 'bg-blue-50', disabled: true },
  { icon: 'lucide:file-text', label: 'Términos y Condiciones', to: '#', color: 'text-purple-500', bg: 'bg-purple-50', disabled: true },
]
</script>

<template>
  <main class="min-h-screen bg-[#F5F7FA] pb-36">
    <!-- Header with Gradient -->
    <div class="relative bg-[#001954] pb-16 pt-safe-top overflow-hidden">
      <!-- Decor -->
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(white 1px, transparent 1px); background-size: 24px 24px;"></div>
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/30 rounded-full blur-2xl"></div>
      
      <div class="relative z-10 px-5 pt-6 pb-6 text-center">
        <h1 class="text-white font-black text-[22px] tracking-tight mb-6">Mi Perfil</h1>
        
        <!-- Avatar -->
        <div class="w-24 h-24 mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/10 shadow-xl mb-4 relative">
          <Icon name="lucide:user" size="40" class="text-white/90" />
          <div class="absolute bottom-0 right-0 w-7 h-7 bg-emerald-400 rounded-full border-2 border-[#001954] flex items-center justify-center">
            <Icon name="lucide:check" size="14" class="text-[#001954]" stroke-width="3" />
          </div>
        </div>
        
        <h2 class="text-white font-bold text-[20px]">{{ user?.nombre || 'Usuario' }}</h2>
        <p class="text-white/60 text-[14px] font-medium">{{ userPhone }}</p>
      </div>
    </div>

    <!-- Content Card -->
    <div class="px-5 -mt-10 relative z-20">
      <div class="bg-white rounded-[24px] shadow-lg shadow-[#001954]/5 p-2 border border-gray-100/50 mb-6">
        <template v-for="(item, index) in menuItems" :key="index">
          <NuxtLink 
            :to="item.to"
            :class="[
              'flex items-center justify-between p-4 rounded-xl transition-all active:scale-[0.98]',
              item.disabled ? 'opacity-50 pointer-events-none grayscale' : 'hover:bg-gray-50'
            ]"
          >
            <div class="flex items-center gap-4">
              <div :class="`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center transition-transform group-hover:scale-110`">
                <Icon :name="item.icon" size="20" :class="item.color" />
              </div>
              <span class="text-[#001954] font-bold text-[14px]">{{ item.label }}</span>
            </div>
            <Icon name="lucide:chevron-right" size="18" class="text-gray-300" />
          </NuxtLink>
          <div v-if="index < menuItems.length - 1" class="h-px bg-gray-50 mx-4"></div>
        </template>
      </div>

      <!-- Logout -->
      <button 
        @click="handleLogout"
        class="w-full bg-red-50 text-red-500 font-bold p-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-red-100 hover:text-red-600 mb-8"
      >
        <Icon name="lucide:log-out" size="18" />
        <span>Cerrar sesión</span>
      </button>

      <!-- Acerca de -->
      <div class="bg-white rounded-[24px] shadow-lg shadow-[#001954]/5 p-6 border border-gray-100/50 mb-6">
        <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Acerca de</p>
        <p class="text-[14px] text-gray-500 leading-relaxed mb-5">
          Servicio de entrega 24/7 de bebidas y botanas a domicilio en Morelia. La fiesta no para.
        </p>

        <div class="space-y-2">
          <a
            href="https://www.facebook.com/24HrsDeFiesta"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-4 p-3 rounded-xl active:bg-gray-50 transition-colors"
          >
            <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Icon name="lucide:facebook" size="20" class="text-blue-600" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-[14px] font-bold text-[#001954] block">Facebook</span>
              <span class="text-[12px] text-gray-400">@24HrsDeFiesta</span>
            </div>
            <Icon name="lucide:external-link" size="16" class="text-gray-300" />
          </a>

          <div class="h-px bg-gray-50 mx-3"></div>

          <a
            href="https://maps.app.goo.gl/RB59vaMkVCt9FHHC6"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-4 p-3 rounded-xl active:bg-gray-50 transition-colors"
          >
            <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Icon name="lucide:map-pin" size="20" class="text-red-500" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-[14px] font-bold text-[#001954] block">Google Maps</span>
              <span class="text-[12px] text-gray-400">Ver ubicación de la tienda</span>
            </div>
            <Icon name="lucide:external-link" size="16" class="text-gray-300" />
          </a>
        </div>
      </div>

      <div class="text-center">
        <p class="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Versión 1.0.0</p>
      </div>
    </div>

    <UIBottomNav />
  </main>
</template>

<style scoped>
.pt-safe-top {
  padding-top: max(env(safe-area-inset-top), 20px);
}
</style>
