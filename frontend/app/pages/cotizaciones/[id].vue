<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import MaterialesCotizacionTable from '../../components/cotizaciones/MaterialesCotizacionTable.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const route = useRoute()
const { authFetch } = useAuth()

const loading = ref(false)
const changingStatus = ref(false)
const cotizacion = ref(null)

const materialesDetalle = computed(() => {
  const mats = cotizacion.value?.Materials || cotizacion.value?.Materials || []
  return mats.map((item) => ({
    materialId: item.id,
    nombre: item.nombre,
    cantidad: item.CotizacionMaterial?.cantidad || 0,
    precio_unitario: item.CotizacionMaterial?.precio_unitario || 0
  }))
})

const subtotal = computed(() => Number(cotizacion.value?.subtotal_materiales || 0))
const manoObra = computed(() => Number(cotizacion.value?.mano_obra || 0))
const total = computed(() => Number(cotizacion.value?.total || 0))

const cargarCotizacion = async () => {
  loading.value = true
  try {
    cotizacion.value = await authFetch(`/cotizaciones/${route.params.id}`, {
      method: 'GET'
    })
  } catch (error) {
    alert(error?.data?.message || 'No se pudo cargar la cotización')
    await navigateTo('/cotizaciones')
  } finally {
    loading.value = false
  }
}

const cambiarEstado = async (estado) => {
  changingStatus.value = true
  try {
    cotizacion.value = await authFetch(`/cotizaciones/${route.params.id}/estado`, {
      method: 'PATCH',
      body: { estado }
    })
  } catch (error) {
    alert(
      error?.data?.detalle ||
      error?.data?.message ||
      'No se pudo actualizar el estado'
    )
  } finally {
    changingStatus.value = false
  }
}

onMounted(async () => {
  await cargarCotizacion()
})
</script>

<template>
  <div class="detalle-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Detalle de cotización</h1>
        <p class="page-subtitle">
          Información completa de la cotización seleccionada.
        </p>
      </div>

      <div class="header-actions">
        <NuxtLink to="/cotizaciones" class="back-link">
          <v-btn variant="text">Volver</v-btn>
        </NuxtLink>

        <v-btn
          v-if="cotizacion?.estado === 'pendiente'"
          class="btn-primary"
          :loading="changingStatus"
          @click="cambiarEstado('cancelado')"
        >
          Cancelar
        </v-btn>
      </div>
    </div>

    <div v-if="loading" class="loading-box">
      <v-progress-circular indeterminate color="deep-orange" />
      <span>Cargando detalle...</span>
    </div>

    <template v-else-if="cotizacion">
      <v-card class="info-card" elevation="0">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Cliente</span>
            <span class="info-value">{{ cotizacion.cliente_nombre }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Teléfono</span>
            <span class="info-value">{{ cotizacion.cliente_telefono || '—' }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value">{{ cotizacion.cliente_email || '—' }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Tipo de trabajo</span>
            <span class="info-value">{{ cotizacion.tipo_trabajo || '—' }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Estado</span>
            <span class="info-value">{{ cotizacion.estado }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Tiempo estimado</span>
            <span class="info-value">{{ cotizacion.tiempo_estimado }} día(s)</span>
          </div>

          <div class="info-item wide">
            <span class="info-label">Descripción</span>
            <span class="info-value">{{ cotizacion.descripcion }}</span>
          </div>
        </div>
      </v-card>

      <MaterialesCotizacionTable
        :items="materialesDetalle"
        :read-only="true"
      />

      <v-card class="totals-card" elevation="0">
        <h2 class="section-title">Totales</h2>

        <div class="totals-grid">
          <div class="total-box">
            <span class="total-label">Subtotal materiales</span>
            <span class="total-value">L {{ subtotal.toFixed(2) }}</span>
          </div>

          <div class="total-box">
            <span class="total-label">Mano de obra</span>
            <span class="total-value">L {{ manoObra.toFixed(2) }}</span>
          </div>

          <div class="total-box total-box-highlight">
            <span class="total-label">Total</span>
            <span class="total-value">L {{ total.toFixed(2) }}</span>
          </div>
        </div>
      </v-card>

      <v-card
        v-if="cotizacion.estado === 'pendiente'"
        class="next-step-card"
        elevation="0"
      >
        <h2 class="section-title">Siguiente paso</h2>
        <p class="next-step-text">
          La aprobación para crear trabajo con fecha estimada la conectamos después./
        </p>
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

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.back-link {
  text-decoration: none;
}

.btn-primary {
  background: #ff6a00 !important;
  color: white !important;
  font-weight: 700;
  border-radius: 12px;
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
.totals-card,
.next-step-card {
  background: linear-gradient(180deg, #0f1c2b 0%, #132238 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 18px;
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
  margin-bottom: 8px;
}

.info-value {
  color: #eef4fb;
  font-weight: 700;
}

.section-title {
  margin: 0 0 14px 0;
  font-size: 1.25rem;
  font-weight: 800;
}

.totals-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 14px;
}

.total-box {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 14px;
  padding: 14px;
}

.total-box-highlight {
  border: 1px solid rgba(255, 106, 0, 0.28);
}

.total-label {
  display: block;
  color: #9caec5;
  margin-bottom: 8px;
}

.total-value {
  font-size: 1.15rem;
  font-weight: 800;
  color: #ff9f4a;
}

.next-step-text {
  margin: 0;
  color: #dfe7f4;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .info-grid,
  .totals-grid {
    grid-template-columns: 1fr;
  }
}
</style>