import { defineStore } from 'pinia'
import { useSupabaseApi } from '~/composables/useSupabaseApi'
import type { Product, Category } from '~/interfaces/product.interface'

export const useProductsStore = defineStore('products', () => {
  const api = useSupabaseApi()

  const _products = ref<Product[]>([])
  const _categories = ref<Category[]>([])
  const _selectedCategory = ref<Category>({ id: 'all', nombre: 'Todas' })
  const _searchQuery = ref<string>('')
  const _isLoading = ref(false)
  const _error = ref<string | null>(null)

  // Getters
  const products = computed(() => _products.value)
  const categories = computed(() => _categories.value)
  const selectedCategory = computed(() => _selectedCategory.value)
  const searchQuery = computed(() => _searchQuery.value)
  const isLoading = computed(() => _isLoading.value)
  const error = computed(() => _error.value)

  const sortedCategories = computed(() => {
    return [..._categories.value].sort((a, b) => a.nombre.localeCompare(b.nombre))
  })

  const searchFilteredProducts = computed(() => {
    if (!_searchQuery.value?.trim()) return _products.value

    const query = _searchQuery.value.toLowerCase().trim()
    return _products.value.filter(product =>
      product.nombre.toLowerCase().includes(query)
    )
  })

  const shouldShowAllProducts = computed(() => _selectedCategory.value?.id === 'all')

  const groupedByCategory = computed(() => {
    if (!shouldShowAllProducts.value || !sortedCategories.value.length) return []

    const productsByCategory = new Map<string, Product[]>()

    for (const product of searchFilteredProducts.value) {
      const categoryId = product.categoria_id
      if (!productsByCategory.has(categoryId)) {
        productsByCategory.set(categoryId, [])
      }
      productsByCategory.get(categoryId)!.push(product)
    }

    return sortedCategories.value
      .map(category => ({
        category,
        products: productsByCategory.get(category.id) || []
      }))
      .filter(group => group.products.length > 0)
  })

  const filteredProducts = computed(() => {
    let filteredProducts = searchFilteredProducts.value

    if (_selectedCategory.value?.id && _selectedCategory.value.id !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.categoria_id === _selectedCategory.value?.id)
    }

    return filteredProducts
  })

  const processedData = computed(() => {
    if (shouldShowAllProducts.value) {
      return { type: 'grouped' as const, data: groupedByCategory.value }
    } else {
      return { type: 'filtered' as const, data: filteredProducts.value }
    }
  })

  const hasData = computed(() => !!(_categories.value.length && _products.value.length))
  const shouldShowFilteredProducts = computed(() =>
    hasData.value && _selectedCategory.value && !shouldShowAllProducts.value
  )

  // Setters
  const setProducts = (products: Product[]) => {
    _products.value = products
  }

  const setCategories = (categories: Category[]) => {
    _categories.value = categories
  }

  const setSelectedCategory = (category: Category) => {
    _selectedCategory.value = category
  }

  const setSearchQuery = (query: string) => {
    _searchQuery.value = query
  }

  const setLoading = (loading: boolean) => {
    _isLoading.value = loading
  }

  const setError = (error: string | null) => {
    _error.value = error
  }

  // Actions
  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [categoriesData, productsData] = await Promise.all([
        api.fetchLazy<Category[]>('/categorias?activa=eq.true&select=id,nombre', { key: 'categories' }),
        api.fetchLazy<Product[]>('/productos?activo=eq.true&select=*', { key: 'products' })
      ])

      console.log('Categories response:', categoriesData)
      console.log('Products response:', productsData)

      if (categoriesData.error.value) {
        console.error('Categories error:', categoriesData.error.value)
        setError('Error al cargar las categorías')
        return
      }

      if (productsData.error.value) {
        console.error('Products error:', productsData.error.value)
        setError('Error al cargar los productos')
        return
      }

      if (categoriesData.data.value) {
        setCategories(categoriesData.data.value)
      }
      if (productsData.data.value) {
        setProducts(productsData.data.value)
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSelectedCategory({ id: 'all', nombre: 'Todas' })
    setSearchQuery('')
  }

  return {
    // Getters
    products,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    error,
    sortedCategories,
    searchFilteredProducts,
    shouldShowAllProducts,
    groupedByCategory,
    filteredProducts,
    processedData,
    hasData,
    shouldShowFilteredProducts,
    // Setters
    setProducts,
    setCategories,
    setSelectedCategory,
    setSearchQuery,
    setLoading,
    setError,
    // Actions
    fetchData,
    clearFilters
  }
})