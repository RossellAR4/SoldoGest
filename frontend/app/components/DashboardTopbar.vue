<script setup>
import { computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

const { getUser, logout, usuario } = useAuth()

const user = computed(() => getUser() || null)

onMounted(() => {
  console.log('COOKIE USUARIO EN TOPBAR:', usuario.value)
  console.log('USER PARSEADO EN TOPBAR:', user.value)
})
</script>

<template>
  <header class="topbar">
    <div>
      <div class="topbar-title">Dashboard</div>
      <div class="topbar-subtitle">Gestión del taller</div>
    </div>

    <div class="topbar-right">
      <div class="user-box" v-if="user">
        <div class="user-name">{{ user.nombre || 'Usuario' }}</div>
        <div class="user-role">{{ user.rol || '' }}</div>
      </div>

      <div class="user-box" v-else>
        <div class="user-name">Usuario</div>
        <div class="user-role">Sin datos</div>
      </div>

      <v-btn class="logout-btn" variant="flat" @click="logout">
        Salir
      </v-btn>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(7, 16, 31, 0.7);
  color: white;
}

.topbar-title {
  font-size: 1.35rem;
  font-weight: 800;
}

.topbar-subtitle {
  font-size: 0.9rem;
  color: #aeb9cb;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-box {
  text-align: right;
  line-height: 1.1;
}

.user-name {
  font-weight: 700;
}

.user-role {
  font-size: 0.85rem;
  color: #b3bdd0;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.08) !important;
  color: white !important;
  border-radius: 12px;
}
</style>