<script setup>
import { computed } from 'vue'
import TrabajoEstadoChip from './TrabajoEstadoChip.vue'

const props = defineProps({
  trabajo: {
    type: Object,
    required: true
  }
})

const clienteNombre = computed(() => {
  return props.trabajo?.Cliente?.nombre || 'Sin cliente'
})

const fechaInicio = computed(() => {
  if (!props.trabajo?.fecha_inicio) return '—'
  return new Date(props.trabajo.fecha_inicio).toLocaleDateString('es-HN')
})

const fechaInstalacion = computed(() => {
  if (!props.trabajo?.fecha_estimada_instalacion) return '—'
  return new Date(props.trabajo.fecha_estimada_instalacion).toLocaleDateString('es-HN')
})

const totalFormateado = computed(() => {
  return `L ${Number(props.trabajo?.total || 0).toFixed(2)}`
})
</script>

<template>
  <NuxtLink :to="`/trabajos/${trabajo.id}`" class="trabajo-card">
    <div class="card-top">
      <div>
        <h3 class="card-title">Trabajo #{{ trabajo.id }}</h3>
        <p class="card-client">{{ clienteNombre }}</p>
      </div>

      <TrabajoEstadoChip :estado="trabajo.estado" />
    </div>

    <div class="card-body">
      <p class="card-description">
        {{ trabajo.descripcion || 'Sin descripción' }}
      </p>

      <div class="card-grid">
        <div class="info-box">
          <span class="info-label">Inicio</span>
          <span class="info-value">{{ fechaInicio }}</span>
        </div>

        <div class="info-box">
          <span class="info-label">Instalación</span>
          <span class="info-value">{{ fechaInstalacion }}</span>
        </div>

        <div class="info-box">
          <span class="info-label">Total</span>
          <span class="info-value total-highlight">{{ totalFormateado }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.trabajo-card {
  display: block;
  text-decoration: none;
  color: white;
  background: linear-gradient(180deg, #0f1c2b 0%, #132238 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 20px;
  transition: 0.2s ease;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.15);
}

.trabajo-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 106, 0, 0.45);
  box-shadow: 0 0 20px rgba(255, 106, 0, 0.12);
}

.card-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
}

.card-client {
  margin: 6px 0 0 0;
  color: #aab6c9;
  font-size: 0.95rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-description {
  margin: 0;
  color: #dce5f1;
  line-height: 1.5;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 12px;
}

.info-box {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 14px;
  padding: 12px;
}

.info-label {
  display: block;
  font-size: 0.8rem;
  color: #97a8bf;
  margin-bottom: 6px;
}

.info-value {
  font-weight: 700;
  color: #f3f7fd;
}

.total-highlight {
  color: #ff8a2a;
}

@media (max-width: 700px) {
  .card-top {
    flex-direction: column;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>