import { defineStore } from 'pinia'
import type { Address, DeliveryMethod, PaymentMethod } from '~/interfaces'

export const useOrderStore = defineStore('order', () => {
  const _phone = ref<string>('')

  const _addressList = ref<Address[]>([])
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

  // Delivery location and cost
  const _deliveryLocation = ref<{ lat: number; lng: number } | null>(null)
  const _deliveryCost = ref<number>(50) // Default cost
  const _deliveryDistance = ref<number>(0)
  const _deliveryDuration = ref<number>(0)

  // Getters
  const phone = computed(() => _phone.value)
  const addressList = computed(() => _addressList.value)
  const selectedAddress = computed(() => _selectedAddress.value)
  const paymentMethods = computed(() => _paymentMethods.value)
  const selectedPaymentMethod = computed(() => _selectedPaymentMethod.value)
  const deliveryMethods = computed(() => _deliveryMethods.value)
  const selectedDeliveryMethod = computed(() => _selectedDeliveryMethod.value)
  const deliveryLocation = computed(() => _deliveryLocation.value)
  const deliveryCost = computed(() => _deliveryCost.value)
  const deliveryDistance = computed(() => _deliveryDistance.value)
  const deliveryDuration = computed(() => _deliveryDuration.value)

  // Validación de dirección
  const isValidAddress = computed(() => {
    if (!_selectedAddress.value) return false

    const address = _selectedAddress.value
    return !!(
      address.id &&
      address.street &&
      address.colony &&
      address.id !== '' &&
      address.street !== '' &&
      address.colony !== ''
    )
  })

  const canPlaceOrder = computed(() => {
    return !!(
      _phone.value &&
      isValidAddress.value &&
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

  const setDeliveryLocation = (location: { lat: number; lng: number }) => {
    _deliveryLocation.value = location
  }

  const setDeliveryCost = (cost: number) => {
    _deliveryCost.value = cost
  }

  const setDeliveryDistance = (distance: number) => {
    _deliveryDistance.value = distance
  }

  const setDeliveryDuration = (duration: number) => {
    _deliveryDuration.value = duration
  }

  // Actions
  const initializeDefaults = () => {
    // Inicializar dirección con campos vacíos
    if (!_selectedAddress.value) {
      _selectedAddress.value = {
        id: '',
        street: '',
        colony: '',
        reference: ''
      }
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
    deliveryLocation,
    deliveryCost,
    deliveryDistance,
    deliveryDuration,
    isValidAddress,
    canPlaceOrder,
    // Setters
    setPhone,
    setAddressList,
    setSelectedAddress,
    setPaymentMethods,
    setSelectedPaymentMethod,
    setDeliveryMethods,
    setSelectedDeliveryMethod,
    setDeliveryLocation,
    setDeliveryCost,
    setDeliveryDistance,
    setDeliveryDuration,
    // Actions
    initializeDefaults,
    addNewAddress
  }
})