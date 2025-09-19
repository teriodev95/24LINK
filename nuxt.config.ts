// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseAuthToken: process.env.NUXT_SUPABASE_AUTH_TOKEN,

    // Public keys (exposed to client-side)
    public: {
      supabaseApiKey: process.env.NUXT_SUPABASE_API_KEY
    }
  }
})