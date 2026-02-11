<script setup lang="ts">
import type { OrderStatus } from '~/interfaces/order.interface'

interface StepData {
  status: OrderStatus
  title: string
  description: string
  icon: string
  shortLabel: string
}

interface Props {
  currentStatus: OrderStatus
  orderNumber?: string
  orderDate?: string
  createdAt?: string
  updatedAt?: string
}

const props = defineProps<Props>()

const steps: StepData[] = [
  {
    status: 'nuevo',
    title: 'Pedido recibido',
    description: 'Estamos arrancando para llevártelo, tú tranqui.',
    icon: 'lucide:clipboard-check',
    shortLabel: 'Recibido'
  },
  {
    status: 'aceptado',
    title: 'Listo.',
    description: 'Tu pedido quedó confirmado y ya lo estamos preparando.',
    icon: 'lucide:package-check',
    shortLabel: 'Confirmado'
  },
  {
    status: 'en_ruta',
    title: 'En camino',
    description: 'La fiesta está por llegar.',
    icon: 'lucide:bike',
    shortLabel: 'En camino'
  },
  {
    status: 'completado',
    title: 'Pedido entregado.',
    description: 'Disfrútalo y que no se apague la noche.',
    icon: 'lucide:party-popper',
    shortLabel: 'Entregado'
  }
]

const cancelledStep: StepData = {
  status: 'cancelado',
  title: 'Cancelado',
  description: 'El pedido fue cancelado',
  icon: 'lucide:x-circle',
  shortLabel: 'Cancelado'
}

const statusOrder: Record<string, number> = {
  'nuevo': 0,
  'aceptado': 1,
  'en_ruta': 2,
  'completado': 3,
}

const currentStepIndex = computed(() => statusOrder[props.currentStatus] ?? -1)
const isCancelled = computed(() => props.currentStatus === 'cancelado')

const isStepDone = (index: number) => index < currentStepIndex.value
const isStepActive = (index: number) => index === currentStepIndex.value

const getIconName = (index: number) => {
  if (isStepDone(index)) return 'lucide:check'
  return steps[index].icon
}

const getStepTime = (index: number) => {
  // Logic to show approximate times based on status
  if (index === 0 && props.createdAt) {
    return new Date(props.createdAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  }
  if (isStepActive(index) && props.updatedAt) {
    return new Date(props.updatedAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  }
  return null
}
</script>

<template>
  <div class="relative pl-1">
    <!-- Cancelled State -->
    <div v-if="isCancelled" class="flex items-center gap-4 py-4 bg-red-50 rounded-xl px-4 border border-red-100">
      <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
        <Icon :name="cancelledStep.icon" size="20" class="text-red-500" />
      </div>
      <div>
        <p class="text-[15px] font-bold text-red-600">{{ cancelledStep.title }}</p>
        <p class="text-[13px] text-red-400">{{ cancelledStep.description }}</p>
      </div>
    </div>

    <!-- Active Stepper -->
    <div v-else class="space-y-0 relative">
      <div
        v-for="(step, index) in steps"
        :key="step.status"
        class="group relative flex items-stretch gap-4 z-10"
        :class="{ 'pb-8': index < steps.length - 1 }"
      >
        <!-- Icon/Line Column -->
        <div class="relative shrink-0 flex flex-col items-center">
          
          <!-- Connector Line (Colored) -->
          <div
            v-if="index < steps.length - 1"
            class="absolute top-8 left-1/2 -translate-x-1/2 w-[3px] h-[calc(100%)] transition-all duration-500 delay-100 origin-top"
            :class="isStepDone(index) ? 'bg-emerald-500' : 'bg-gray-100'"
          />

          <!-- Circle Indicator -->
          <div
            class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm border-[3px]"
            :class="[
              isStepActive(index) ? 'bg-white border-[#001954] shadow-md scale-110' : 
              isStepDone(index) ? 'bg-emerald-500 border-emerald-500 text-white' : 
              'bg-white border-gray-100 text-gray-300'
            ]"
          >
             <!-- Pulse Effect for Active -->
             <span v-if="isStepActive(index)" class="absolute inset-0 rounded-full animate-ping bg-[#001954] opacity-20 duration-1000"></span>
            
            <Icon
              :name="getIconName(index)"
              size="16"
              :class="isStepActive(index) ? 'text-[#001954]' : isStepDone(index) ? 'text-white' : 'text-gray-300'"
            />
          </div>
        </div>

        <!-- Content Column -->
        <div class="pt-1 flex-1 flex justify-between items-start min-h-[48px]">
          <div>
            <p
              class="text-[14px] font-bold transition-colors duration-300 leading-tight"
              :class="isStepActive(index) ? 'text-[#001954]' : isStepDone(index) ? 'text-[#001954]/80' : 'text-gray-400'"
            >
              {{ step.title }}
            </p>
            <p
              class="text-[12px] mt-1 transition-colors duration-300 leading-snug"
               :class="isStepActive(index) ? 'text-[#001954]/70 font-medium' : 'text-gray-400'"
            >
              {{ step.description }}
            </p>
          </div>
          
          <!-- Timestamp (if available) -->
          <div v-if="getStepTime(index)" class="flex flex-col items-end animate-fade-in">
             <span class="text-[10px] font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 tabular-nums">
               {{ getStepTime(index) }}
             </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
