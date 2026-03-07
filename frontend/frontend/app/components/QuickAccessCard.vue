<script setup>
defineProps({
  title: String,
  subtitle: String,
  to: String
})
</script>

<template>
  <NuxtLink :to="to" class="quick-card">
    <div class="quick-title">{{ title }}</div>
    <div class="quick-subtitle">{{ subtitle }}</div>
  </NuxtLink>
</template>

<style scoped>
.quick-card {
  display: block;
  text-decoration: none;
  color: white;
  background: rgba(12, 22, 40, 0.95);
  border: 2px solid #ff6a00;
  border-radius: 18px;
  padding: 26px 20px;
  min-height: 120px;
  transition: 0.2s ease;
  box-shadow: 0 0 18px rgba(255, 106, 0, 0.08);
}

.quick-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 24px rgba(255, 106, 0, 0.18);
}

.quick-title {
  text-align: center;
  color: #ff7a00;
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.quick-subtitle {
  text-align: center;
  color: #d5deeb;
  font-size: 0.95rem;
}
</style>