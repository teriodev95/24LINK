<script setup lang="ts">
import { ref, computed, nextTick, watch, onUnmounted } from 'vue';
import type { Product } from '~/interfaces/product.interface';

interface Emits {
  (e: 'action:expand', productId: string): void
  (e: 'action:collapse'): void
}

interface Props {
  product: Product
  isExpanded?: boolean
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const imageLoaded = ref(false);
const quantity = ref(0);
const isEditingQuantity = ref(false);
const tempQuantity = ref(0);
const quantityInput = ref<HTMLInputElement>();
let inactivityTimer: ReturnType<typeof setTimeout> | null = null;

const hasProductInCart = computed(() => quantity.value > 0);
const canAddMore = computed(() => {
  return quantity.value < props.product.stock;
});

const startEdit = async () => {
  tempQuantity.value = quantity.value;
  isEditingQuantity.value = true;
  startInactivityTimer(); // Resetear timer al empezar a editar
  await nextTick();
  quantityInput.value?.focus();
  quantityInput.value?.select();
};

const saveQuantity = () => {
  const newValue = Math.max(0, Math.min(tempQuantity.value, props.product.stock));
  quantity.value = newValue;
  isEditingQuantity.value = false;
};

const cancelEdit = () => {
  isEditingQuantity.value = false;
};

const startInactivityTimer = () => {
  clearInactivityTimer();
  inactivityTimer = setTimeout(() => {
    if (isEditingQuantity.value) {
      isEditingQuantity.value = false;
    }
    if (props.isExpanded) {
      emit('action:collapse');
    }
  }, 4000); // 10 segundos
};

const clearInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
};

// Resetear timer cuando quantity cambie
watch(quantity, () => {
  startInactivityTimer();
});


// Iniciar timer cuando se expande
watch(() => props.isExpanded, (newExpanded) => {
  if (newExpanded) {
    startInactivityTimer();
  } else {
    clearInactivityTimer();
  }
});

// Limpiar timer al desmontar
onUnmounted(() => {
  clearInactivityTimer();
});
</script>

<template>
  <div class="space-y-1 text-sm font-normal relative">
    <figure class="size-[94px] relative overflow-hidden rounded-md">
      <div v-if="!imageLoaded" class="absolute inset-0 bg-gray-200 animate-pulse" />
      <NuxtImg :src="product.imagen_url || '/img/beer.jpg'" :alt="product.nombre"
        :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }" width="94" height="94"
        class="w-full h-full object-cover transition-opacity duration-300" loading="lazy" @load="imageLoaded = true"
        @error="imageLoaded = true" />
    </figure>

    <p>{{ product.nombre }}</p> {{ inactivityTimer }}

    <p class="text-[#717272]">MXM {{ formatCurrency(product.precio) }}</p>


    <div class="absolute right-0 top-0" :class="{ 'left-0': isExpanded }">
      <button v-if="!isExpanded"
        class="rounded-full bg-white size-8 shadow-[0_5px_15px_0_rgba(0,0,0,0.15)] flex items-center justify-center"
        :class="[hasProductInCart ? 'text-sm' : 'text-2xl']" @click="emit('action:expand', product.id)">
        {{ hasProductInCart ? quantity : '+' }}
      </button>

      <div v-else class="bg-white rounded-full shadow-[0_5px_15px_0_rgba(0,0,0,0.15)] flex items-center h-8 px-2">
        <button class="text-xl w-6 h-6 flex items-center justify-center" :class="{ 'text-gray-400': quantity === 0 }"
          @click="quantity > 0 && quantity--">
          -
        </button>
        <input v-if="isEditingQuantity" ref="quantityInput" v-model.number="tempQuantity" type="number" :min="0"
          :max="props.product.stock" step="1"
          class="px-2 text-sm font-medium flex-1 text-center bg-transparent border-none outline-none w-8"
          @blur="saveQuantity" @keydown.enter="saveQuantity" @keydown.escape="cancelEdit"
          @input="tempQuantity = Math.floor(Math.abs(tempQuantity)); startInactivityTimer()"
          @keydown="startInactivityTimer()" @focus="startInactivityTimer()">
        <span v-else class="px-2 text-sm font-medium flex-1 text-center cursor-pointer" @click="startEdit">
          {{ quantity }}
        </span>
        <button class="text-xl w-6 h-6 flex items-center justify-center" :class="{ 'text-gray-400': !canAddMore }"
          :disabled="!canAddMore" @click="canAddMore && quantity++">
          +
        </button>
      </div>
    </div>
  </div>
</template>
