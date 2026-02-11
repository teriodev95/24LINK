<script setup lang="ts">
interface Props {
  driverName: string
  driverPhone: string
  deliveryAddress: string
}

const props = defineProps<Props>()

const showConfirm = ref(false)
const targetUrl = ref('')
const hasError = ref(false)

const whatsappUrl = computed(() => {
  const cleanPhone = props.driverPhone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}`
})

const phoneUrl = computed(() => {
  return `tel:${props.driverPhone}`
})

const initiateContact = (type: 'whatsapp' | 'call') => {
  targetUrl.value = type === 'whatsapp' ? whatsappUrl.value : phoneUrl.value
  showConfirm.value = true
}

const confirmContact = () => {
  window.open(targetUrl.value, '_blank')
  showConfirm.value = false
}
</script>

<template>
  <div class="relative w-full">
    <!-- Main Card (Clean White Design) -->
    <div class="relative w-full overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
      
      <div class="flex flex-col gap-6">
        
        <!-- Header -->
        <div class="flex items-center justify-between">
          <span class="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Tu Repartidor</span>
          <div class="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-100">
             <span class="relative flex h-2 w-2">
               <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
               <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
             </span>
             <span class="text-[10px] font-bold tracking-wide text-emerald-700">EN CAMINO</span>
          </div>
        </div>

        <!-- Content Row -->
        <div class="flex items-center justify-between">
          
          <!-- Driver Info -->
          <div class="flex items-center gap-4">
            <div class="relative">
              <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400">
                 <Icon name="lucide:user" size="24" />
              </div>
              <div class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                 <Icon name="lucide:shield-check" size="10" class="text-white" />
              </div>
            </div>
            
            <div class="flex flex-col">
              <h2 class="text-lg font-bold text-[#001954] leading-tight">{{ driverName }}</h2>
              <div class="mt-1 flex items-center gap-1">
                 <div class="flex gap-0.5">
                    <Icon name="ri:star-fill" size="13" class="text-amber-400" />
                    <Icon name="ri:star-fill" size="13" class="text-amber-400" />
                    <Icon name="ri:star-fill" size="13" class="text-amber-400" />
                    <Icon name="ri:star-fill" size="13" class="text-amber-400" />
                    <Icon name="ri:star-fill" size="13" class="text-amber-400" />
                 </div>
                 <span class="text-xs font-bold text-slate-400 ml-1">4.9</span>
              </div>
            </div>
          </div>

          <!-- Motorcycle Image -->
          <div class="relative h-20 w-24 flex items-center justify-center">
             <NuxtImg
               src="/images/moto.webp" 
               alt="Repartidor" 
               class="h-full w-full object-contain drop-shadow-xl transform translate-x-1" 
               @error="hasError = true"
               v-if="!hasError"
             />
             
             <!-- Fallback if NuxtImg fails to behave as expected visually or strictly for local dev reference -->
             <div v-if="hasError" class="absolute inset-0 flex items-center justify-center text-slate-200">
                <Icon name="lucide:bike" size="32" />
             </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="h-px w-full bg-slate-50"></div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="initiateContact('whatsapp')"
            class="group/btn relative flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#001954] text-[13px] font-bold text-white shadow-lg shadow-[#001954]/20 transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            <Icon name="lucide:message-circle" size="16" class="text-emerald-400 transition-transform group-hover/btn:scale-110" />
            <span>WhatsApp</span>
          </button>
          
          <button
            @click="initiateContact('call')"
            class="group/btn flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-50 text-[13px] font-bold text-slate-600 transition-all hover:bg-slate-100 active:scale-[0.98]"
          >
            <Icon name="lucide:phone" size="16" class="text-slate-400 transition-transform group-hover/btn:scale-110" />
            <span>Llamar</span>
          </button>
        </div>

      </div>
    </div>

    <!-- Confirmation Dialog -->
    <Teleport to="body">
      <div v-if="showConfirm" class="fixed inset-0 z-[60] flex items-center justify-center bg-[#001954]/40 px-6 backdrop-blur-sm transition-all duration-300 animate-in fade-in" @click="showConfirm = false">
        
        <div class="relative flex w-full max-w-[320px] transform flex-col items-center overflow-hidden rounded-[32px] bg-white p-8 text-center shadow-2xl transition-all duration-300 animate-in zoom-in-95" @click.stop>
           
           <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 ring-8 ring-amber-50/50 text-amber-500">
              <Icon name="lucide:alert-triangle" size="24" />
           </div>

           <h3 class="mb-2 text-lg font-bold text-[#001954] leading-tight">¿Es urgente?</h3>
           
           <p class="mb-6 text-sm font-medium leading-relaxed text-slate-500">
             Tu repartidor podría estar conduciendo. Contáctalo solo si es necesario.
           </p>

           <div class="flex w-full flex-col gap-3">
              <button 
                @click="showConfirm = false"
                class="flex h-11 w-full items-center justify-center rounded-xl bg-[#001954] text-sm font-bold text-white shadow-md shadow-[#001954]/20 transition-transform active:scale-[0.98]"
              >
                Entendido, esperaré
              </button>
              
              <button 
                @click="confirmContact"
                class="flex h-11 w-full items-center justify-center rounded-xl text-xs font-bold text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 active:scale-[0.98]"
              >
                Contactar de todos modos
              </button>
           </div>

        </div>
      </div>
    </Teleport>
  </div>
</template>
