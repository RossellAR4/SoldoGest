<script setup>
import Sidebar from '../components/Sidebar.vue'
import Topbar from '../components/Topbar.vue'
</script>

<template>
  <div class="dash">
    <Sidebar />
    <div class="main">
      <Topbar />
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash{
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: #0b1220;
  color: #e5e7eb;
}

.main{
  display: flex;
  flex-direction: column;
}

.content{
  padding: 24px;
}
</style>