<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
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
const creandoTrabajo = ref(false)
const cotizacion = ref(null)

const showTrabajoDialog = ref(false)
const fechaEstimadaInstalacion = ref('')
const yaIntentoImprimir = ref(false)

const materialesDetalle = computed(() => {
  const mats = cotizacion.value?.Materials || []

  return mats.map((item) => ({
    materialId: item.id,
    nombre: item.nombre,
    cantidad: item.CotizacionMaterial?.cantidad || 0,
    precio_unitario: item.CotizacionMaterial?.precio_unitario || 0,
    subtotal: item.CotizacionMaterial?.subtotal || 0
  }))
})

const subtotal = computed(() => Number(cotizacion.value?.subtotal_materiales || 0))
const manoObra = computed(() => Number(cotizacion.value?.mano_obra || 0))
const total = computed(() => Number(cotizacion.value?.total || 0))

const puedeAprobar = computed(() => {
  return cotizacion.value?.estado === 'pendiente'
})

const puedeCrearTrabajo = computed(() => {
  return cotizacion.value?.estado === 'aprobado'
})

const cargarCotizacion = async () => {
  loading.value = true
  try {
    cotizacion.value = await authFetch(`/cotizaciones/${route.params.id}`, {
      method: 'GET'
    })

    await intentarImprimirAutomaticamente()
  } catch (error) {
    console.error('Error cargando cotización:', error)
    alert(
      error?.data?.detalle ||
      error?.data?.message ||
      'No se pudo cargar la cotización'
    )
    await navigateTo('/cotizaciones')
  } finally {
    loading.value = false
  }
}

const intentarImprimirAutomaticamente = async () => {
  if (yaIntentoImprimir.value) return
  if (route.query.print !== '1') return
  if (!cotizacion.value) return

  yaIntentoImprimir.value = true

  await nextTick()

  setTimeout(() => {
    window.print()
  }, 500)
}

const imprimirCotizacion = () => {
  window.print()
}

const cambiarEstado = async (estado) => {
  changingStatus.value = true
  try {
    cotizacion.value = await authFetch(`/cotizaciones/${route.params.id}/estado`, {
      method: 'PATCH',
      body: { estado }
    })

    if (estado === 'aprobado') {
      alert('Cotización aprobada correctamente')
    }

    if (estado === 'cancelado') {
      alert('Cotización cancelada correctamente')
    }
  } catch (error) {
    console.error('Error actualizando estado:', error)
    alert(
      error?.data?.detalle ||
      error?.data?.message ||
      'No se pudo actualizar el estado'
    )
  } finally {
    changingStatus.value = false
  }
}

const abrirDialogTrabajo = () => {
  fechaEstimadaInstalacion.value = ''
  showTrabajoDialog.value = true
}

const crearTrabajoDesdeCotizacion = async () => {
  if (!fechaEstimadaInstalacion.value) {
    alert('Debes indicar la fecha estimada de instalación')
    return
  }

  creandoTrabajo.value = true
  try {
    const trabajo = await authFetch('/trabajos/desde-cotizacion', {
      method: 'POST',
      body: {
        cotizacionId: cotizacion.value.id,
        fecha_estimada_instalacion: fechaEstimadaInstalacion.value
      }
    })

    showTrabajoDialog.value = false
    alert('Trabajo creado correctamente')
    await navigateTo(`/trabajos/${trabajo.id}`)
  } catch (error) {
    console.error('Error creando trabajo:', error)
    alert(
      error?.data?.detalle ||
      error?.data?.message ||
      'No se pudo crear el trabajo'
    )
  } finally {
    creandoTrabajo.value = false
  }
}

onMounted(async () => {
  await cargarCotizacion()
})
</script>

<template>
  <div class="detalle-page print-area">
    <div class="page-header no-print">
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
          class="btn-primary"
          @click="imprimirCotizacion"
        >
          Imprimir
        </v-btn>

        <v-btn
          v-if="puedeAprobar"
          class="btn-success"
          :loading="changingStatus"
          @click="cambiarEstado('aprobado')"
        >
          Aprobar
        </v-btn>

        <v-btn
          v-if="puedeAprobar"
          class="btn-danger"
          :loading="changingStatus"
          @click="cambiarEstado('cancelado')"
        >
          Cancelar
        </v-btn>

        <v-btn
          v-if="puedeCrearTrabajo"
          class="btn-primary"
          @click="abrirDialogTrabajo"
        >
          Crear trabajo
        </v-btn>
      </div>
    </div>

    <div v-if="loading" class="loading-box no-print">
      <v-progress-circular indeterminate color="deep-orange" />
      <span>Cargando detalle...</span>
    </div>

    <template v-else-if="cotizacion">
      <v-card class="info-card" elevation="0">
        <div class="print-title">
          <h2>COTIZACIÓN #{{ cotizacion.id }}</h2>
          <p>SoldoGest</p>
        </div>

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
            <span class="info-value estado-text">{{ cotizacion.estado }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Tiempo estimado</span>
            <span class="info-value">{{ cotizacion.tiempo_estimado }} día(s)</span>
          </div>

          <div class="info-item">
            <span class="info-label">Fecha emisión</span>
            <span class="info-value">
              {{ cotizacion.fecha_emision ? new Date(cotizacion.fecha_emision).toLocaleDateString('es-HN') : '—' }}
            </span>
          </div>

          <div class="info-item">
            <span class="info-label">Fecha validez</span>
            <span class="info-value">
              {{ cotizacion.fecha_validez ? new Date(cotizacion.fecha_validez).toLocaleDateString('es-HN') : '—' }}
            </span>
          </div>

          <div class="info-item wide">
            <span class="info-label">Descripción</span>
            <span class="info-value">{{ cotizacion.descripcion }}</span>
          </div>
        </div>
      </v-card>

      <v-card class="materiales-card" elevation="0">
        <h2 class="section-title">Materiales</h2>

        <div v-if="materialesDetalle.length" class="materiales-table-wrap">
          <table class="materiales-table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in materialesDetalle"
                :key="item.materialId"
              >
                <td>{{ item.nombre }}</td>
                <td>{{ Number(item.cantidad).toFixed(2) }}</td>
                <td>L {{ Number(item.precio_unitario).toFixed(2) }}</td>
                <td>L {{ Number(item.subtotal).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="empty-materiales">
          No hay materiales en esta cotización.
        </div>
      </v-card>

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
    </template>

    <v-dialog v-model="showTrabajoDialog" max-width="520" class="no-print">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          Crear trabajo desde cotización
        </v-card-title>

        <v-card-text class="dialog-body">
          <p class="dialog-text">
            Ingresa la fecha estimada de instalación para crear el trabajo.
          </p>

          <v-alert
            v-if="!cotizacion?.clienteId"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            Esta cotización no tiene cliente registrado. El sistema lo creará automáticamente usando los datos guardados en la cotización.
          </v-alert>

          <v-text-field
            v-model="fechaEstimadaInstalacion"
            type="date"
            label="Fecha estimada de instalación"
            variant="outlined"
            class="field-dark"
          />
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-spacer />
          <v-btn variant="text" @click="showTrabajoDialog = false">
            Cancelar
          </v-btn>
          <v-btn
            class="btn-primary"
            :loading="creandoTrabajo"
            @click="crearTrabajoDesdeCotizacion"
          >
            Crear trabajo
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  flex-wrap: wrap;
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

.btn-success {
  background: #2e7d32 !important;
  color: white !important;
  font-weight: 700;
  border-radius: 12px;
}

.btn-danger {
  background: #c62828 !important;
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
.materiales-card,
.totals-card,
.dialog-card {
  background: linear-gradient(180deg, #0f1c2b 0%, #132238 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 18px;
}

.print-title {
  text-align: center;
  margin-bottom: 18px;
}

.print-title h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
}

.print-title p {
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

.estado-text {
  text-transform: capitalize;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 16px 0;
}

.materiales-table-wrap {
  overflow-x: auto;
}

.materiales-table {
  width: 100%;
  border-collapse: collapse;
}

.materiales-table th,
.materiales-table td {
  padding: 12px 10px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.materiales-table th {
  color: #9caec5;
  font-size: 0.9rem;
  font-weight: 700;
}

.materiales-table td {
  color: #ffffff;
}

.empty-materiales {
  color: #aab6c9;
}

.totals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.total-box {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 14px;
  padding: 16px;
}

.total-box-highlight {
  border: 1px solid rgba(255, 106, 0, 0.35);
  background: rgba(255, 106, 0, 0.08);
}

.total-label {
  display: block;
  color: #9caec5;
  font-size: 0.88rem;
  margin-bottom: 6px;
}

.total-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: white;
}

.dialog-title {
  color: white;
  font-weight: 800;
  padding-bottom: 0;
}

.dialog-body {
  padding-top: 10px;
}

.dialog-text {
  margin: 0 0 16px 0;
  color: #d7e0ec;
  line-height: 1.6;
}

.dialog-actions {
  padding-top: 0;
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
  .info-grid,
  .totals-grid {
    grid-template-columns: 1fr;
  }
}

@media print {
  .no-print {
    display: none !important;
  }

  .detalle-page {
    color: #000 !important;
    gap: 10px;
  }

  .info-card,
  .materiales-card,
  .totals-card {
    background: #ffffff !important;
    color: #000 !important;
    border: 1px solid #d0d0d0 !important;
    box-shadow: none !important;
  }

  .info-item,
  .total-box {
    background: #ffffff !important;
    border: 1px solid #e3e3e3 !important;
  }

  .info-label,
  .print-title p,
  .total-label,
  .materiales-table th {
    color: #555 !important;
  }

  .info-value,
  .total-value,
  .print-title h2,
  .section-title,
  .materiales-table td {
    color: #000 !important;
  }

  .materiales-table th,
  .materiales-table td {
    border-bottom: 1px solid #d9d9d9 !important;
  }
}
</style>