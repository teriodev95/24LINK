<script setup lang="ts">
const { isAuthenticated, user, logout, userPhone } = useAuth()

if (!isAuthenticated.value) {
  navigateTo('/verificacion')
}

const handleLogout = () => {
  logout()
  navigateTo('/')
}
</script>

<template>
  <main class="min-h-screen bg-gray-50 pb-36">
    <div class="px-4 pt-4 pb-2">
      <h1 class="text-2xl font-bold text-[#001954]">Mi Perfil</h1>
    </div>

    <div v-if="isAuthenticated && user" class="px-4 mt-4 space-y-4">
      <!-- User info card -->
      <div class="bg-white rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-[#001954] rounded-full flex items-center justify-center">
            <LucideUser class="w-7 h-7 text-white" />
          </div>
          <div>
            <p class="font-bold text-[#001954] text-lg">{{ user.nombre || 'Usuario' }}</p>
            <p class="text-sm text-gray-500">{{ userPhone }}</p>
          </div>
        </div>
      </div>

      <!-- Logout button -->
      <button
        class="w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 text-red-500 active:scale-[0.98] transition-transform cursor-pointer"
        @click="handleLogout"
      >
        <LucideLogOut class="w-5 h-5" />
        <span class="font-medium">Cerrar sesión</span>
      </button>
    </div>

    <UIBottomNav />
  </main>
</template>
