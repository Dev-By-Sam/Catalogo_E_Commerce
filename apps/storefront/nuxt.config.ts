// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiUrl: process.env.PUBLIC_API_URL || 'http://localhost:4000/api',
      storeName: process.env.STORE_NAME || 'KINETIC // INDUSTRIAL',
      whatsappNumber: process.env.STORE_WHATSAPP_NUMBER || '1234567890',
    },
  },

  app: {
    head: {
      title: 'KINETIC // Avant-Garde E-Commerce Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Architectural precision goods, technical apparel and monolithic physical instruments.',
        },
        { name: 'theme-color', content: '#0a0a0a' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap',
        },
      ],
    },
  },

  build: {
    transpile: ['three', 'echarts', 'vue-echarts', 'lucide-vue-next'],
  },

  nitro: {
    compressPublicAssets: true,
  },
})
