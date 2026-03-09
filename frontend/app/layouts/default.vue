<template>
  <v-app>
    <div class="main-layout">
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