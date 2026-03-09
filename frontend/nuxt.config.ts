export default defineNuxtConfig({
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css'
  ],

  build: {
    transpile: ['vuetify']
  },

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3001/api/v1'
    }
  }
})