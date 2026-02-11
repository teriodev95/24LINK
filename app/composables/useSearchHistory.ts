const STORAGE_KEY = 'search_history'
const MAX_ITEMS = 10

export function useSearchHistory() {
  const history = ref<string[]>(load())

  function load(): string[] {
    if (import.meta.server) return []
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  }

  function add(term: string) {
    const clean = term.trim()
    if (!clean) return
    history.value = [clean, ...history.value.filter(t => t !== clean)].slice(0, MAX_ITEMS)
    save()
  }

  function remove(term: string) {
    history.value = history.value.filter(t => t !== term)
    save()
  }

  function clear() {
    history.value = []
    save()
  }

  return { history: readonly(history), add, remove, clear }
}
