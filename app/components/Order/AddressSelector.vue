<template>
  <div class="space-y-2">
    <h3 class="text-secondary">{{ title }} 🚚</h3>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center p-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#001954]" />
      <span class="ml-2 text-gray-500">Cargando direcciones...</span>
    </div>

    <!-- Addresses list -->
    <div v-else class="flex overflow-scroll gap-2 p-2">
      <NuxtLink
        :to="addButtonLink"
        class="rounded-lg w-14 h-14 p-2 drop-shadow-lg bg-white flex-shrink-0 flex justify-center items-center"
      >
        <LucidePlus class="m-auto" />
      </NuxtLink>

      <UISelectionButton
        v-for="address in addresses"
        :key="address.id"
        :item="{ title: address.street, description: address.colony }"
        :is-selected="selectedAddress?.id === address.id"
        custom-class="whitespace-nowrap h-14"
        :disabled="isCalculating"
        @select="$emit('select', address)"
      />

      <!-- Empty state -->
      <div v-if="addresses.length === 0" class="text-gray-500 text-sm p-2">
        {{ emptyStateMessage }}
      </div>
    </div>

    <!-- Calculating indicator -->
    <div v-if="isCalculating" class="flex items-center gap-2 p-2 text-sm text-gray-600">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#001954]" />
      <span>{{ calculatingMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Address } from '~/interfaces'

interface Props {
  addresses: Address[]
  selectedAddress?: Address | null
  isLoading?: boolean
  isCalculating?: boolean
  title?: string
  addButtonLink?: string
  emptyStateMessage?: string
  calculatingMessage?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Dirección de entrega',
  addButtonLink: '/ubicacion',
  emptyStateMessage: 'No tienes direcciones guardadas. Agrega una nueva.',
  calculatingMessage: 'Calculando costo de envío...'
})

defineEmits<{
  select: [address: Address]
}>()
</script>