import { computed } from 'vue'
import type { Category, Product } from '~/interfaces/product.interface'

interface UseProductFilteringOptions {
  products: Product[]
  categories?: Category[]
  selectedCategory?: Category
  searchQuery?: string
  groupByCategory?: boolean
}

export function useProductFiltering(options: UseProductFilteringOptions) {
  const sortedCategories = computed(() => {
    if (!options.categories) return []
    return [...options.categories].sort((a, b) => a.nombre.localeCompare(b.nombre))
  })

  const searchFilteredProducts = computed(() => {
    if (!options.searchQuery?.trim()) return options.products

    const query = options.searchQuery.toLowerCase().trim()
    return options.products.filter(product =>
      product.nombre.toLowerCase().includes(query)
    )
  })

  const groupedByCategory = computed(() => {
    if (!options.groupByCategory || !sortedCategories.value.length) return []

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
    let products = searchFilteredProducts.value

    if (options.selectedCategory?.id && options.selectedCategory.id !== 'all') {
      products = products.filter(product => product.categoria_id === options.selectedCategory?.id)
    }

    return products
  })

  const processedData = computed(() => {
    if (options.groupByCategory) {
      return { type: 'grouped' as const, data: groupedByCategory.value }
    } else {
      return { type: 'filtered' as const, data: filteredProducts.value }
    }
  })

  return {
    processedData,
    sortedCategories,
    searchFilteredProducts,
    groupedByCategory,
    filteredProducts
  }
}