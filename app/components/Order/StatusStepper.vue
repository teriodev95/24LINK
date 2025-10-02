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
      status: 'creado',
      title: 'Nuevo 🎯',
      description: 'Tu pedido fue levantado con éxito, a la espera de que se acepte en sucursal',
      time: '22:42 PM'
    },
    {
      status: 'confirmado',
      title: 'Aceptado ✅',
      description: 'Tu pedido fue aceptado en sucursal. En espera de que sea armado y embolsado',
      time: '22:55 PM'
    },
    {
      status: 'en_ruta',
      title: 'En ruta 🛵',
      description: 'Tu pedido esta en ruta hacía la dirección indicada',
      time: '22:57 PM'
    },
    {
      status: 'entregado',
      title: 'Completado 🏁',
      description: 'Tu pedido fue completado con éxito, puedes calificar nuestro servicio haciendo clic aquí',
      time: '23:30 PM'
    },
    {
      status: 'cancelado',
      title: 'Cancelado ❌',
      description: 'No pudimos entregar tu pedido.',
      time: ''
    }
  ]
})

const statusOrder: Record<OrderStatus, number> = {
  'creado': 0,
  'confirmado': 1,
  'en_ruta': 2,
  'entregado': 3,
  'cancelado': 4
}

const currentStepIndex = computed(() => {
  return statusOrder[props.currentStatus]
})

const isStepCompleted = (stepIndex: number): boolean => {
  return stepIndex < currentStepIndex.value
}

const isCurrentStep = (step: StepData): boolean => {
  return step.status === props.currentStatus
}

const getStepClasses = (step: StepData): string => {
  const stepIndex = statusOrder[step.status]

  if (isStepCompleted(stepIndex)) {
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
    <div v-for="(step, index) in steps" :key="step.status" class="relative flex items-start">
      <!-- Timeline line -->
      <div v-if="index < steps.length - 1" class="absolute left-3 top-6 w-0.5 bg-gray-200"
        :class="{ 'bg-green-500': isStepCompleted(index) }" :style="{ height: 'calc(100% + 1rem)' }" />

      <!-- Status indicator -->
      <div class="relative flex h-6 w-6 flex-shrink-0 items-center justify-center z-10">
        <div class="h-6 w-6 rounded-full border-2 flex items-center justify-center" :class="getStepClasses(step)">
          <LucideCheck v-if="isStepCompleted(index)" class="h-3 w-3 text-white" />
          <div v-else-if="isCurrentStep(step)" class="h-2 w-2 rounded-full bg-white" />
        </div>
      </div>

      <!-- Content -->
      <div class="ml-4 flex-1">
        <div class="flex items-center justify-between">
          <h3 class="text-primary">
            {{ step.title }}
          </h3>
          <span v-if="step.time" class="text-tertiary">
            {{ step.time }}
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-600">
          {{ step.description }}
        </p>
        <div v-if="step.status === 'en_ruta'">
          hola
        </div>
      </div>
    </div>
  </UISection>
</template>