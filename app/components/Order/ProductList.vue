<script setup lang="ts">
import type { CartProduct } from '~/interfaces'
import formatCurrency from '~/utils/formatCurrency'

interface Props {
  products: CartProduct[]
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
})

const cartStore = useCartStore()
const productsStore = useProductsStore()

const getProduct = (id: string) => productsStore.getProductById(id)

const handleIncrement = (productId: string) => {
  const product = getProduct(productId)
  if (product) cartStore.incrementQuantity(product)
}

const handleDecrement = (productId: string) => {
  cartStore.decrementQuantity(productId)
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-3 px-1">
      <p class="text-[13px] font-semibold text-gray-400 uppercase tracking-wider">
        Productos
      </p>
      <span class="text-[12px] text-gray-400">{{ products.length }} artículo{{ products.length !== 1 ? 's' : '' }}</span>
    </div>

    <div class="space-y-2">
      <div
        v-for="product in products"
        :key="product.id"
        class="flex items-center gap-3 bg-gray-50/80 rounded-2xl p-3"
      >
        <!-- Image -->
        <div class="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0">
          <img
            :src="product.imagen_url || '/img/beer.jpg'"
            :alt="product.nombre"
            class="w-full h-full object-cover"
            loading="lazy"
          >
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-[13px] font-semibold text-[#001954] truncate leading-tight">
            {{ product.nombre }}
          </p>
          <p class="text-[13px] text-gray-400 mt-0.5">
            MXN {{ formatCurrency(product.precio_unitario) }}
          </p>
        </div>

        <!-- Editable: Quantity controls + line total -->
        <div v-if="!readonly" class="flex flex-col items-end gap-1.5 shrink-0">
          <div class="flex items-center gap-0.5">
            <button
              class="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-90"
              :class="product.cantidad <= 1 ? 'bg-red-50 text-red-400' : 'bg-gray-200/80 text-[#001954]'"
              @click="handleDecrement(product.id)"
            >
              <Icon :name="product.cantidad <= 1 ? 'lucide:trash-2' : 'lucide:minus'" size="14" />
            </button>
            <span class="w-7 text-center text-[13px] font-bold text-[#001954]">
              {{ product.cantidad }}
            </span>
            <button
              class="w-7 h-7 rounded-lg bg-[#001954] text-white flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-90 disabled:opacity-30"
              :disabled="!getProduct(product.id) || !cartStore.canAddMore(getProduct(product.id)!)"
              @click="handleIncrement(product.id)"
            >
              <Icon name="lucide:plus" size="14" />
            </button>
          </div>
          <span class="text-[12px] font-semibold text-[#001954]">
            MXN {{ formatCurrency(product.precio_unitario * product.cantidad) }}
          </span>
        </div>

        <!-- Readonly: quantity badge + line total -->
        <div v-else class="flex flex-col items-end gap-0.5 shrink-0">
          <span class="text-[11px] text-gray-400">x{{ product.cantidad }}</span>
          <span class="text-[12px] font-semibold text-[#001954]">
            MXN {{ formatCurrency(product.precio_unitario * product.cantidad) }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
