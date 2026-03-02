<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const go = (path) => router.push(path)

const isActive = (path) => route.path === path
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="logo">SG</div>
      <div>
        <div class="name">SoldoGest</div>
        <div class="tag">Sistema Web</div>
      </div>
    </div>

    <nav class="nav">
      <button :class="['item', isActive('/home') && 'active']" @click="go('/home')">🏠 Inicio</button>
      <button class="item" @click="go('/clientes')">👤 Clientes</button>
      <button class="item" @click="go('/materiales')">🧱 Materiales</button>
      <button class="item" @click="go('/cotizaciones')">📄 Cotizaciones</button>
      <button class="item" @click="go('/trabajos')">🔧 Trabajos</button>
    </nav>

    <div class="foot">
      <small>API v1</small>
    </div>
  </aside>
</template>

<style scoped>
.sidebar{
  padding: 18px;
  border-right: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
}

.brand{
  display:flex;
  align-items:center;
  gap: 12px;
  padding: 10px 8px 18px;
}

.logo{
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.10);
  font-weight: 900;
}

.name{ font-weight: 900; }
.tag{ font-size: 12px; opacity: 0.75; }

.nav{
  display:flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.item{
  text-align:left;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.04);
  color: #e5e7eb;
  cursor: pointer;
}

.item.active{
  border-color: rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.08);
}

.foot{
  margin-top: 18px;
  opacity: 0.7;
}
</style>