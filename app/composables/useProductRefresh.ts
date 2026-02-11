export function useProductRefresh() {
  const productsStore = useProductsStore()

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      productsStore.refreshIfStale()
    }
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  const router = useRouter()
  router.afterEach(() => {
    productsStore.refreshIfStale()
  })
}
