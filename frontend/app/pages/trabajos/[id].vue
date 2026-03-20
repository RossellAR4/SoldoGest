<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import TrabajoEstadoChip from '../../components/trabajos/TrabajoEstadoChip.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const route = useRoute()
const { authFetch } = useAuth()

const trabajo = ref(null)
const loading = ref(false)
const cambiandoEstado = ref(false)

const estados = [
  { label: 'En proceso', value: 'en_proceso' },
  { label: 'Finalizado', value: 'finalizado' },
  { label: 'Cancelado', value: 'cancelado' }
]

const cargarTrabajo = async () => {
  loading.value = true
  try {
    trabajo.value = await authFetch(`/trabajos/${route.params.id}`, {
      method: 'GET'
    })
  } catch (error) {
    console.error('Error cargando trabajo:', error)
    alert(
      error?.data?.detalle ||
      error?.data?.message ||
      'No se pudo cargar el trabajo'
    )
    await navigateTo('/trabajos')
  } finally {
    loading.value = false
  }
}

const cambiarEstado = async (estado) => {
  if (!estado) return

  cambiandoEstado.value = true
  try {
    trabajo.value = await authFetch(`/trabajos/${route.params.id}/estado`, {
      method: 'PATCH',
      body: { estado }
    })

    alert('Estado actualizado correctamente')
  } catch (error) {
    console.error('Error actualizando estado:', error)
    alert(
      error?.data?.detalle ||
      error?.data?.message ||
      'No se pudo actualizar el estado'
    )
  } finally {
    cambiandoEstado.value = false
  }
}

onMounted(async () => {
  await cargarTrabajo()
})
</script>

<template>
  <div class="detalle-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Detalle de trabajo</h1>
        <p class="page-subtitle">
          Consulta la información completa del trabajo.
        </p>
      </div>

      <NuxtLink to="/trabajos" class="back-link">
        <v-btn variant="text">Volver</v-btn>
      </NuxtLink>
    </div>

    <div v-if="loading" class="loading-box">
      <v-progress-circular indeterminate color="deep-orange" />
      <span>Cargando detalle...</span>
    </div>

    <template v-else-if="trabajo">
      <v-card class="info-card" elevation="0">
        <div class="top-row">
          <div>
            <h2 class="trabajo-title">Trabajo #{{ trabajo.id }}</h2>
            <p class="trabajo-subtitle">
              {{ trabajo.Cliente?.nombre || 'Sin cliente' }}
            </p>
          </div>

          <TrabajoEstadoChip :estado="trabajo.estado" />
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Cliente</span>
            <span class="info-value">{{ trabajo.Cliente?.nombre || '—' }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Cotización origen</span>
            <span class="info-value">{{ trabajo.cotizacionId || 'Manual' }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Fecha inicio</span>
            <span class="info-value">
              {{ trabajo.fecha_inicio ? new Date(trabajo.fecha_inicio).toLocaleDateString('es-HN') : '—' }}
            </span>
          </div>

          <div class="info-item">
            <span class="info-label">Fecha estimada instalación</span>
            <span class="info-value">
              {{ trabajo.fecha_estimada_instalacion ? new Date(trabajo.fecha_estimada_instalacion).toLocaleDateString('es-HN') : '—' }}
            </span>
          </div>

          <div class="info-item">
            <span class="info-label">Fecha finalización</span>
            <span class="info-value">
              {{ trabajo.fecha_finalizacion ? new Date(trabajo.fecha_finalizacion).toLocaleDateString('es-HN') : '—' }}
            </span>
          </div>

          <div class="info-item">
            <span class="info-label">Total</span>
            <span class="info-value total-value">
              L {{ Number(trabajo.total || 0).toFixed(2) }}
            </span>
          </div>

          <div class="info-item wide">
            <span class="info-label">Descripción</span>
            <span class="info-value">{{ trabajo.descripcion }}</span>
          </div>
        </div>
      </v-card>

      <v-card class="status-card" elevation="0">
        <h2 class="section-title">Actualizar estado</h2>

        <div class="status-row">
          <v-select
            :items="estados"
            item-title="label"
            item-value="value"
            label="Estado"
            variant="outlined"
            class="field-dark"
            :model-value="trabajo.estado"
            :loading="cambiandoEstado"
            @update:modelValue="cambiarEstado"
          />
        </div>
      </v-card>
    </template>
  </div>
</template>

<style scoped>
.detalle-page {
  color: white;
  display: grid;
  gap: 18px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
}

.page-subtitle {
  margin: 6px 0 0 0;
  color: #aab6c9;
}

.back-link {
  text-decoration: none;
}

.loading-box {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 14px;
}

.info-card,
.status-card {
  background: linear-gradient(180deg, #0f1c2b 0%, #132238 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 18px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.trabajo-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
}

.trabajo-subtitle {
  margin: 6px 0 0 0;
  color: #aab6c9;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.info-item {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 14px;
  padding: 14px;
}

.info-item.wide {
  grid-column: 1 / -1;
}

.info-label {
  display: block;
  color: #9caec5;
  font-size: 0.88rem;
  margin-bottom: 6px;
}

.info-value {
  display: block;
  color: #ffffff;
  font-weight: 700;
  word-break: break-word;
}

.total-value {
  color: #ff8a2a;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 16px 0;
}

.status-row {
  max-width: 360px;
}

:deep(.field-dark .v-field) {
  background: rgba(255, 255, 255, 0.03) !important;
  border-radius: 14px !important;
  color: white !important;
}

:deep(.field-dark input) {
  color: white !important;
}

:deep(.field-dark .v-label) {
  color: #9caec5 !important;
}

@media (max-width: 900px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .top-row {
    flex-direction: column;
  }
}
</style>