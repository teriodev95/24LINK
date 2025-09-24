// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
				css: ['@/assets/css/main.css'],
				vite: {
								plugins: [tailwindcss()],
				},
  modules: [
		 '@nuxt/eslint',
		 '@nuxt/image',
		 '@nuxt/fonts',
		 '@pinia/nuxt',
		 "nuxt-lucide-icons",
		 "@nuxtjs/leaflet",
		],
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseAuthToken: process.env.NUXT_SUPABASE_AUTH_TOKEN,

    // Public keys (exposed to client-side)
    public: {
      supabaseApiKey: process.env.NUXT_SUPABASE_API_KEY
    }
  },
image: {
	domains: ["https://db.el24.cc"],
	dir: "public",
	format: ["webp"],
	quality: 80,
},
fonts: {
	families: [
		{
			name: "Fira Sans",
			provider: "google",
			weights: [300, 400, 500, 600, 700, 800],
			styles: ["normal"],
			subsets: ["latin"],
			global: true,
		},
	],
	defaults: {
		fallbacks: {
			"sans-serif": ["Arial", "Helvetica", "sans-serif"],
		},
	},
},
})