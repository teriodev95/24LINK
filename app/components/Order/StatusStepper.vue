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
      description: 'Tu pedido ya está con nosotros. Estamos arrancando para llevártelo, tú tranqui.',
      icon: 'lucide:package',
      time: ''
    },
    {
      status: 'aceptado',
      title: 'Aceptado',
      description: 'Listo. Tu pedido quedó confirmado y ya lo estamos preparando.',
      icon: 'lucide:check-circle',
      time: ''
    },
    {
      status: 'en_ruta',
      title: 'En camino',
      description: 'Tu pedido ya va rumbo a ti. La fiesta está por llegar.',
      icon: 'lucide:bike',
      time: ''
    },
    {
      status: 'completado',
      title: 'Entregado',
      description: 'Pedido entregado. Disfrútalo y que no se apague la noche.',
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

const getCircleSize = (step: StepData): string => {
  if (isCurrentStep(step)) {
    return 'w-11 h-11'
  }
  return 'w-10 h-10'
}

const getCircleClasses = (step: StepData): string => {
  const stepIndex = statusOrder[step.status]

  if (step.status === 'cancelado' && isCurrentStep(step)) {
    return 'bg-red-500 text-white shadow-[0_0_0_4px_rgba(239,68,68,0.15)]'
  } else if (isCurrentStep(step)) {
    return 'bg-emerald-500 text-white shadow-[0_0_0_5px_rgba(16,185,129,0.15)]'
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
        :class="{ 'pb-7': index < visibleSteps.length - 1 }"
      >
        <!-- Timeline line (centered on circle: left = 20px center, w-0.5) -->
        <div
          v-if="index < visibleSteps.length - 1"
          class="absolute top-[44px] bottom-0 w-[2px] rounded-full"
          :class="getLineClasses(step)"
          :style="{ left: isCurrentStep(step) ? '21px' : '19px' }"
        />

        <!-- Status circle -->
        <div class="relative z-10 shrink-0" :class="getCircleSize(step)">
          <span
            v-if="isCurrentStep(step) && step.status !== 'cancelado' && step.status !== 'completado'"
            class="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping"
          />
          <div
            class="relative rounded-full flex items-center justify-center transition-all duration-300"
            :class="[getCircleSize(step), getCircleClasses(step)]"
          >
            <Icon v-if="isStepCompleted(statusOrder[step.status])" name="lucide:check" :size="isCurrentStep(step) ? '20' : '18'" />
            <Icon v-else :name="step.icon" :size="isCurrentStep(step) ? '20' : '18'" />
          </div>
        </div>

        <!-- Step content — vertically centered with circle -->
        <div class="ml-4 flex-1 min-h-[40px] flex flex-col justify-center">
          <p
            class="font-semibold leading-tight"
            :class="[isCurrentStep(step) ? 'text-[16px]' : 'text-[14px]', getTitleClasses(step)]"
          >
            {{ step.title }}
          </p>
          <p
            v-if="isCurrentStep(step)"
            class="text-[13px] mt-1.5 leading-relaxed"
            :class="step.status === 'cancelado' ? 'text-red-400' : 'text-gray-500'"
          >
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
