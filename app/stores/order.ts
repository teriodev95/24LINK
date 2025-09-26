import { defineStore } from 'pinia'

interface Address {
  id: string
  street: string
  colony: string
}

interface PaymentMethod {
  type: string
  title: string
  description: string
}

interface DeliveryMethod {
  type: string
  title: string
}

export const useOrderStore = defineStore('order', () => {
  const _phone = ref<string>('')

  const _addressList = ref<Address[]>([
    {
      id: '1',
      street: 'Av universidad #1050',
      colony: 'Villa universidad'
    },
  ])
  const _selectedAddress = ref<Address | null>(null)

  const _paymentMethods = ref<PaymentMethod[]>([
    { type: 'card', title: 'Tarjeta', description: 'Solicita la terminal' },
    { type: 'cash', title: 'Efectivo', description: 'Paga con efectivo' },
    { type: 'mixed', title: 'Mixto', description: 'Pago mixto (tarjeta y efectivo)' }
  ])
  const _selectedPaymentMethod = ref<PaymentMethod | null>(null)

  const _deliveryMethods = ref<DeliveryMethod[]>([
    { type: 'outside', title: 'Encontrarse afuera' },
    { type: 'inside', title: 'Entregar en la puerta' }
  ])
  const _selectedDeliveryMethod = ref<DeliveryMethod | null>(null)

  // Getters
  const phone = computed(() => _phone.value)
  const addressList = computed(() => _addressList.value)
  const selectedAddress = computed(() => _selectedAddress.value)
  const paymentMethods = computed(() => _paymentMethods.value)
  const selectedPaymentMethod = computed(() => _selectedPaymentMethod.value)
  const deliveryMethods = computed(() => _deliveryMethods.value)
  const selectedDeliveryMethod = computed(() => _selectedDeliveryMethod.value)
  const canPlaceOrder = computed(() => {
    return !!(
      _phone.value &&
      _selectedAddress.value &&
      _selectedPaymentMethod.value &&
      _selectedDeliveryMethod.value
    )
  })

  // Setters
  const setPhone = (phone: string) => {
    _phone.value = phone
  }

  const setAddressList = (addresses: Address[]) => {
    _addressList.value = addresses
  }

  const setSelectedAddress = (address: Address) => {
    _selectedAddress.value = address
  }

  const setPaymentMethods = (methods: PaymentMethod[]) => {
    _paymentMethods.value = methods
  }

  const setSelectedPaymentMethod = (method: PaymentMethod) => {
    _selectedPaymentMethod.value = method
  }

  const setDeliveryMethods = (methods: DeliveryMethod[]) => {
    _deliveryMethods.value = methods
  }

  const setSelectedDeliveryMethod = (method: DeliveryMethod) => {
    _selectedDeliveryMethod.value = method
  }

  // Actions
  const initializeDefaults = () => {
    if (_addressList.value.length > 0 && !_selectedAddress.value) {
      _selectedAddress.value = _addressList.value[0]!
    }
    if (_paymentMethods.value.length > 0 && !_selectedPaymentMethod.value) {
      _selectedPaymentMethod.value = _paymentMethods.value[0]!
    }
    if (_deliveryMethods.value.length > 0 && !_selectedDeliveryMethod.value) {
      _selectedDeliveryMethod.value = _deliveryMethods.value[0]!
    }
  }

  const addNewAddress = (address: string, reference: string) => {
    const newAddress: Address = {
      id: Date.now().toString(),
      street: address,
      colony: reference
    }

    _addressList.value.unshift(newAddress)
    _selectedAddress.value = newAddress
  }

  return {
    // Getters
    phone,
    addressList,
    selectedAddress,
    paymentMethods,
    selectedPaymentMethod,
    deliveryMethods,
    selectedDeliveryMethod,
    canPlaceOrder,
    // Setters
    setPhone,
    setAddressList,
    setSelectedAddress,
    setPaymentMethods,
    setSelectedPaymentMethod,
    setDeliveryMethods,
    setSelectedDeliveryMethod,
    // Actions
    initializeDefaults,
    addNewAddress
  }
})