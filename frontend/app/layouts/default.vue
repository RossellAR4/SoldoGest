<script setup>
import { computed } from 'vue'

const token = useCookie('token')

const isLoggedIn = computed(() => {
  return !!token.value && token.value !== 'null' && token.value !== 'undefined'
})
</script>

<template>
  <v-app>
    <div v-if="isLoggedIn" class="main-layout">
      <MenuSidebar />

      <div class="main-content">
        <DashboardTopbar />
        <main class="page-content">
          <slot />
        </main>
      </div>
    </div>
  </v-app>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  background: linear-gradient(180deg, #071326 0%, #04101f 100%);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.page-content {
  flex: 1;
  padding: 22px;
}

@media (max-width: 960px) {
  .main-layout {
    flex-direction: column;
  }
}
</style>