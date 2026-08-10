const backendUrl = process.env.NUXT_PUBLIC_API_BASE || 'http://vi-e40df1d09e0c41b8a2027511c9203ac9.ecs.eu-north-1.on.aws';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-08-08',
  devtools: { enabled: true },
  srcDir: '.',
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss'],
  nitro: {
    routeRules: {
      '/api/**': { proxy: `${backendUrl}/api/**` },
      '/uploads/**': { proxy: `${backendUrl}/uploads/**` }
    }
  },
  app: {
    head: {
      title: '3dPreview — Interactive 3D Parallax Experience',
      meta: [
        { name: 'description', content: 'Explore high-precision 3D models with interactive real-time controls.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: backendUrl
    }
  }
})
