<script setup lang="ts">
import type { OrderStatus } from '~/interfaces/order.interface'

interface StepData {
  status: OrderStatus
  title: string
  description: string
  time: string
}

interface Props {
  currentStatus: OrderStatus
  steps?: StepData[]
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => [
    {
      status: 'nuevo',
      title: 'Nuevo 🎯',
      description: 'Tu pedido fue levantado con éxito, a la espera de que se acepte en sucursal',
      time: ''
    },
    {
      status: 'aceptado',
      title: 'Aceptado ✅',
      description: 'Tu pedido fue aceptado en sucursal. En espera de que sea armado y embolsado',
      time: ''
    },
    {
      status: 'en_ruta',
      title: 'En Ruta 🛵',
      description: 'Tu pedido esta en ruta hacía la dirección indicada',
      time: ''
    },
    {
      status: 'completado',
      title: 'Completado 🏁',
      description: 'Tu pedido fue completado con éxito, puedes calificar nuestro servicio haciendo clic aquí',
      time: ''
    },
    {
      status: 'cancelado',
      title: 'Cancelado ❌',
      description: 'No pudimos entregar tu pedido.',
      time: ''
    }
  ]
})

// Filtrar steps: mostrar cancelado solo si es el estado actual
const visibleSteps = computed(() => {
  return props.steps.filter(step => {
    // Siempre mostrar todos los pasos excepto cancelado
    if (step.status === 'cancelado') {
      // Solo mostrar cancelado si es el estado actual
      return props.currentStatus === 'cancelado'
    }
    // Si el pedido está cancelado, no mostrar completado
    if (step.status === 'completado' && props.currentStatus === 'cancelado') {
      return false
    }
    return true
  })
})

const statusOrder: Record<OrderStatus, number> = {
  'nuevo': 0,
  'aceptado': 1,
  'en_ruta': 2,
  'completado': 3,
  'cancelado': 4
}

const currentStepIndex = computed(() => statusOrder[props.currentStatus])
const isStepCompleted = (stepIndex: number): boolean => stepIndex < currentStepIndex.value
const isCurrentStep = (step: StepData): boolean => step.status === props.currentStatus

const getStepClasses = (step: StepData): string => {
  const stepIndex = statusOrder[step.status]

  if (step.status === 'cancelado' && isCurrentStep(step)) {
    return 'bg-red-500 border-red-500'
  } else if (isStepCompleted(stepIndex)) {
    return 'bg-green-500 border-green-500'
  } else if (isCurrentStep(step)) {
    return 'bg-green-500 border-green-500'
  } else {
    return 'bg-white border-gray-300'
  }
}
</script>

<template>
  <UISection class="space-y-4">
    <div v-for="(step, index) in visibleSteps" :key="step.status" class="relative flex items-start">
      <!-- Timeline line -->
      <div v-if="index < visibleSteps.length - 1" class="absolute left-3 top-6 w-0.5 bg-gray-200"
        :class="{ 'bg-green-500': isStepCompleted(statusOrder[step.status]) }"
        :style="{ height: 'calc(100% + 1rem)' }" />

      <!-- Status indicator -->
      <div class="relative flex h-6 w-6 flex-shrink-0 items-center justify-center z-10">
        <div class="h-6 w-6 rounded-full border-2 flex items-center justify-center" :class="getStepClasses(step)">
          <LucideCheck v-if="isStepCompleted(statusOrder[step.status])" class="h-3 w-3 text-white" />
          <div v-else-if="isCurrentStep(step)" class="h-2 w-2 rounded-full bg-white" />
        </div>
      </div>

      <!-- Step content -->
      <div class="ml-4 flex-1 transition-opacity duration-300">
        <h3 class="text-primary">
          {{ step.title }}
        </h3>
        <p class="mt-1 text-sm text-gray-600">
          {{ step.description }}
        </p>
      </div>

    </div>
  </UISection>
</template>