<script setup lang="ts">
import type { OrderStatus } from '~/interfaces/order.interface'

interface StepData {
  status: OrderStatus
  title: string
  description: string
  icon: string
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
      title: 'Pedido recibido',
      description: 'Tu pedido fue levantado con éxito, a la espera de que se acepte en sucursal',
      icon: 'lucide:package',
      time: ''
    },
    {
      status: 'aceptado',
      title: 'Aceptado',
      description: 'Tu pedido fue aceptado en sucursal. En espera de que sea armado y embolsado',
      icon: 'lucide:check-circle',
      time: ''
    },
    {
      status: 'en_ruta',
      title: 'En camino',
      description: 'Tu pedido está en ruta hacia la dirección indicada',
      icon: 'lucide:bike',
      time: ''
    },
    {
      status: 'completado',
      title: 'Entregado',
      description: 'Tu pedido fue completado con éxito',
      icon: 'lucide:party-popper',
      time: ''
    },
    {
      status: 'cancelado',
      title: 'Cancelado',
      description: 'No pudimos entregar tu pedido.',
      icon: 'lucide:x-circle',
      time: ''
    }
  ]
})

const visibleSteps = computed(() => {
  return props.steps.filter(step => {
    if (step.status === 'cancelado') {
      return props.currentStatus === 'cancelado'
    }
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

const getCircleClasses = (step: StepData): string => {
  const stepIndex = statusOrder[step.status]

  if (step.status === 'cancelado' && isCurrentStep(step)) {
    return 'bg-red-500 text-white shadow-[0_0_0_4px_rgba(239,68,68,0.15)]'
  } else if (isCurrentStep(step)) {
    return 'bg-emerald-500 text-white shadow-[0_0_0_4px_rgba(16,185,129,0.15)]'
  } else if (isStepCompleted(stepIndex)) {
    return 'bg-emerald-500 text-white'
  } else {
    return 'bg-gray-100 text-gray-300'
  }
}

const getLineClasses = (step: StepData): string => {
  const stepIndex = statusOrder[step.status]
  if (isStepCompleted(stepIndex)) {
    return 'bg-emerald-500'
  }
  return 'bg-gray-200'
}

const getTitleClasses = (step: StepData): string => {
  const stepIndex = statusOrder[step.status]

  if (step.status === 'cancelado' && isCurrentStep(step)) {
    return 'text-red-600'
  } else if (isStepCompleted(stepIndex) || isCurrentStep(step)) {
    return 'text-[#001954]'
  }
  return 'text-gray-300'
}
</script>

<template>
  <section>
    <p class="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Estado</p>

    <div class="bg-gray-50/80 rounded-2xl px-5 py-5">
      <div
        v-for="(step, index) in visibleSteps"
        :key="step.status"
        class="relative flex items-start"
        :class="{ 'pb-6': index < visibleSteps.length - 1 }"
      >
        <!-- Timeline line (centered on circle: left = 20px center, w-0.5) -->
        <div
          v-if="index < visibleSteps.length - 1"
          class="absolute left-[19px] top-[40px] bottom-0 w-[2px] rounded-full"
          :class="getLineClasses(step)"
        />

        <!-- Status circle — fixed 40x40 -->
        <div class="relative z-10 shrink-0 w-10 h-10">
          <span
            v-if="isCurrentStep(step) && step.status !== 'cancelado' && step.status !== 'completado'"
            class="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping"
          />
          <div
            class="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
            :class="getCircleClasses(step)"
          >
            <Icon v-if="isStepCompleted(statusOrder[step.status])" name="lucide:check" size="18" />
            <Icon v-else :name="step.icon" size="18" />
          </div>
        </div>

        <!-- Step content — vertically centered with circle -->
        <div class="ml-4 flex-1 min-h-[40px] flex flex-col justify-center">
          <p
            class="text-[14px] font-semibold leading-tight"
            :class="getTitleClasses(step)"
          >
            {{ step.title }}
          </p>
          <p
            v-if="isCurrentStep(step)"
            class="text-[12px] mt-1 leading-relaxed"
            :class="step.status === 'cancelado' ? 'text-red-400' : 'text-gray-400'"
          >
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
