<script setup>
import { computed } from 'vue'

const props = defineProps({
  cotizacion: {
    type: Object,
    required: true
  }
})

const clienteNombre = computed(() => {
  return (
    props.cotizacion?.cliente_nombre ||
    props.cotizacion?.Cliente?.nombre ||
    'Sin cliente'
  )
})

const estadoLabel = computed(() => {
  const estado = props.cotizacion?.estado || 'pendiente'

  if (estado === 'aprobado') return 'Aprobada'
  if (estado === 'cancelado') return 'Cancelada'
  if (estado === 'vencido') return 'Vencida'
  return 'Pendiente'
})

const estadoClass = computed(() => {
  const estado = props.cotizacion?.estado || 'pendiente'

  if (estado === 'aprobado') return 'estado-aprobado'
  if (estado === 'cancelado') return 'estado-cancelado'
  if (estado === 'vencido') return 'estado-vencido'
  return 'estado-pendiente'
})

const totalFormateado = computed(() => {
  const total = Number(props.cotizacion?.total || 0)
  return `L ${total.toFixed(2)}`
})

const fechaEmision = computed(() => {
  const value = props.cotizacion?.fecha_emision
  if (!value) return '—'

  return new Date(value).toLocaleDateString('es-HN')
})

const fechaValidez = computed(() => {
  const value = props.cotizacion?.fecha_validez
  if (!value) return '—'

  return new Date(value).toLocaleDateString('es-HN')
})
</script>

<template>
  <NuxtLink :to="`/cotizaciones/${cotizacion.id}`" class="cotizacion-card">
    <div class="card-top">
      <div>
        <h3 class="card-title">
          {{ cotizacion.tipo_trabajo || 'Cotización' }}
        </h3>
        <p class="card-client">
          {{ clienteNombre }}
        </p>
      </div>

      <span class="estado-badge" :class="estadoClass">
        {{ estadoLabel }}
      </span>
    </div>

    <div class="card-body">
      <p class="card-description">
        {{ cotizacion.descripcion || 'Sin descripción' }}
      </p>

      <div class="card-grid">
        <div class="info-box">
          <span class="info-label">Emisión</span>
          <span class="info-value">{{ fechaEmision }}</span>
        </div>

        <div class="info-box">
          <span class="info-label">Validez</span>
          <span class="info-value">{{ fechaValidez }}</span>
        </div>

        <div class="info-box">
          <span class="info-label">Tiempo estimado</span>
          <span class="info-value">
            {{ cotizacion.tiempo_estimado }} día(s)
          </span>
        </div>

        <div class="info-box">
          <span class="info-label">Total</span>
          <span class="info-value total-highlight">
            {{ totalFormateado }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.cotizacion-card {
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

.cotizacion-card:hover {
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

.estado-badge {
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  white-space: nowrap;
}

.estado-pendiente {
  background: rgba(255, 166, 0, 0.18);
  color: #ffbe5c;
  border: 1px solid rgba(255, 190, 92, 0.35);
}

.estado-aprobado {
  background: rgba(76, 175, 80, 0.18);
  color: #9be29d;
  border: 1px solid rgba(155, 226, 157, 0.35);
}

.estado-cancelado {
  background: rgba(255, 99, 71, 0.16);
  color: #ff9a86;
  border: 1px solid rgba(255, 154, 134, 0.35);
}

.estado-vencido {
  background: rgba(120, 144, 156, 0.18);
  color: #c3d0d9;
  border: 1px solid rgba(195, 208, 217, 0.3);
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
  grid-template-columns: repeat(4, minmax(120px, 1fr));
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

@media (max-width: 900px) {
  .card-grid {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
  }
}

@media (max-width: 580px) {
  .card-top {
    flex-direction: column;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>