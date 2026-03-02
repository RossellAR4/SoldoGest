<script setup>
import DashboardLayout from '../layouts/DashboardLayout.vue'
</script>

<template>
  <DashboardLayout>
    <h3 style="margin-top:0;">Accesos rápidos</h3>

    <div class="cards">
      <div class="card">
        <div class="t">Clientes</div>
        <div class="d">Registrar y listar clientes</div>
      </div>
      <div class="card">
        <div class="t">Materiales</div>
        <div class="d">Inventario y medidas</div>
      </div>
      <div class="card">
        <div class="t">Cotizaciones</div>
        <div class="d">Crear y aprobar</div>
      </div>
      <div class="card">
        <div class="t">Trabajos</div>
        <div class="d">Seguimiento de proyectos</div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.cards{
  display:grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.card{
  padding: 22px;
  border-radius: 18px;
  background: rgba(255,255,255,0.05);
  border: 2px solid #ff6a00; /* 🔥 BORDE NARANJA */
  box-shadow: 0 0 12px rgba(255,106,0,0.35); /* glow naranja */
  transition: all 0.2s ease;
  cursor: pointer;
}

.card:hover{
  transform: translateY(-4px);
  box-shadow: 0 0 20px rgba(255,106,0,0.6);
}

.t{
  font-weight: 900;
  margin-bottom: 8px;
  font-size: 16px;
  color: #ff6a00; /* título naranja */
}

.d{
  opacity: 0.85;
  font-size: 13px;
  color: #e5e7eb;
}
</style>