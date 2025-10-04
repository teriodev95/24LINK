import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (config.public.mapboxToken) {
    mapboxgl.accessToken = config.public.mapboxToken as string
    console.log('✅ Mapbox initialized in plugin')
  } else {
    console.error('❌ Mapbox token not found')
  }

  return {
    provide: {
      mapboxgl
    }
  }
})
