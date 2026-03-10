<script setup>
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth'

const { getUser } = useAuth()
const user = computed(() => getUser() || {})

const isAdmin = computed(() => user.value?.rol === 'admin')

const items = computed(() => {
  const menu = [
    { title: 'Inicio', icon: 'mdi-home', to: '/' },
    { title: 'Clientes', icon: 'mdi-account-group', to: '/clientes' },
    { title: 'Materiales', icon: 'mdi-package-variant', to: '/materiales' },
    { title: 'Cotizaciones', icon: 'mdi-file-document-outline', to: '/cotizaciones' },
    { title: 'Trabajos', icon: 'mdi-hammer-wrench', to: '/trabajos' }
  ]

  if (isAdmin.value) {
    menu.splice(1, 0, {
      title: 'Usuarios',
      icon: 'mdi-account-cog',
      to: '/usuarios'
    })
  }

  return menu
})
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="logo-box">SG</div>

      <div>
        <div class="brand-title">SoldoGest</div>
        <div class="brand-subtitle">Sistema Web</div>
      </div>
    </div>

    <nav class="menu">
      <NuxtLink
        v-for="item in items"
        :key="item.title"
        :to="item.to"
        class="menu-link"
        active-class="menu-link-active"
      >
        <v-icon size="18">{{ item.icon }}</v-icon>
        <span>{{ item.title }}</span>
      </NuxtLink>
    </nav>

    <div class="sidebar-footer">
      <div class="api-label">API V1</div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  min-height: 100vh;
  background: linear-gradient(180deg, #111d33 0%, #0b1629 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  padding: 20px 14px;
  color: white;
  display: flex;
  flex-direction: column;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 26px;
}

.logo-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #1f2a44;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
}

.brand-title {
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.1;
}

.brand-subtitle {
  font-size: 0.8rem;
  color: #b4bfd1;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #e7edf7;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 12px 14px;
  transition: 0.2s ease;
}

.menu-link:hover {
  background: rgba(255, 255, 255, 0.07);
}

.menu-link-active {
  border-color: rgba(255, 122, 0, 0.6);
  box-shadow: 0 0 0 1px rgba(255, 122, 0, 0.25) inset;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 20px;
  text-align: center;
}

.api-label {
  color: #aab4c7;
  font-size: 0.85rem;
}

@media (max-width: 960px) {
  .sidebar {
    width: 100%;
    min-height: auto;
  }
}
</style>