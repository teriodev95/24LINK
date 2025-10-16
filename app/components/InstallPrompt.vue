<script setup lang="ts">
const {
  showPrompt,
  setupInstallPrompt,
  handleInstall,
  dismissPrompt
} = useInstallPrompt()

const installing = ref(false)

const handleInstallClick = async () => {
  installing.value = true
  try {
    await handleInstall()
  } finally {
    installing.value = false
  }
}

let cleanup: (() => void) | undefined

onMounted(() => {
  cleanup = setupInstallPrompt()
})

onBeforeUnmount(() => {
  cleanup?.()
})
</script>

<template>
  <UIInstallModal :show="showPrompt" :installing="installing" @install="handleInstallClick" @dismiss="dismissPrompt"
    @close="dismissPrompt" />
</template>