<script setup lang="ts">
interface Props {
  type: 'phone' | 'pin'
  error?: string
  isVerified?: boolean
}

const props = defineProps<Props>()

const successMessage = computed(() => {
  return props.type === 'phone' ? 'Código enviado exitosamente' : 'Código verificado'
})
</script>

<template>
  <Transition enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 transform translate-y-2" enter-to-class="opacity-100 transform translate-y-0"
    leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform translate-y-2">
    <div v-if="error || isVerified">
      <div v-if="error"
        class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
        <LucideAlertCircle :size="16" />
        <span>{{ error }}</span>
      </div>

      <div v-if="isVerified"
        class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
        <LucideCheckCircle2 :size="16" />
        <span>{{ successMessage }}</span>
      </div>
    </div>
  </Transition>
</template>
