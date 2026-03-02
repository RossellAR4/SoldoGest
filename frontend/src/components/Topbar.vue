<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = computed(() => {
  const raw = localStorage.getItem('usuario')
  return raw ? JSON.parse(raw) : null
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  router.push('/login')
}
</script>

<template>
  <header class="topbar">
    <div class="left">
      <h2>Dashboard</h2>
      <span class="hint">Gestión del taller</span>
    </div>

    <div class="right">
      <div class="user">
        <div class="u1">{{ user?.nombre }}</div>
        <div class="u2">{{ user?.rol }}</div>
      </div>
      <button class="btn" @click="logout">Salir</button>
    </div>
  </header>
</template>

<style scoped>
.topbar{
  display:flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
}

.left h2{
  margin:0;
  font-size: 18px;
  font-weight: 900;
}

.hint{
  font-size: 12px;
  opacity: 0.7;
}

.right{
  display:flex;
  align-items:center;
  gap: 12px;
}

.user{
  text-align:right;
  line-height: 1.1;
}
.u1{ font-weight: 800; }
.u2{ font-size: 12px; opacity: 0.75; }

.btn{
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: #e5e7eb;
  cursor: pointer;
}
</style>