<script setup>
import { computed, ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import ClienteCotizacionForm from '../../components/cotizaciones/ClienteCotizacionForm.vue'
import MaterialSelectorDialog from '../../components/cotizaciones/MaterialSelectorDialog.vue'
import MaterialesCotizacionTable from '../../components/cotizaciones/MaterialesCotizacionTable.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const { authFetch } = useAuth()

const saving = ref(false)
const buscandoCliente = ref(false)
const buscandoMaterial = ref(false)
const showMaterialDialog = ref(false)
const clienteEncontrado = ref(false)

const form = ref({
  clienteId: '',
  cliente_nombre: '',
  cliente_telefono: '',
  cliente_email: '',
  tipo_trabajo: '',
  descripcion: '',
  tiempo_estimado: '',
  mano_obra: ''
})

const materiales = ref([])

const subtotalMateriales = computed(() => {
  return materiales.value.reduce((acc, item) => {
    return acc + (Number(item.cantidad || 0) * Number(item.precio_unitario || 0))
  }, 0)
})

const totalCotizacion = computed(() => {
  return subtotalMateriales.value + Number(form.value.mano_obra || 0)
})

const buscarCliente = async () => {
  if (!form.value.clienteId) return

  buscandoCliente.value = true
  try {
    const cliente = await authFetch(`/clientes/${form.value.clienteId}`, {
      method: 'GET'
    })

    form.value.cliente_nombre = cliente.nombre || ''
    form.value.cliente_telefono = cliente.telefono || ''
    form.value.cliente_email = cliente.email || ''
    clienteEncontrado.value = true
  } catch (error) {
    clienteEncontrado.value = false
    form.value.cliente_nombre = ''
    form.value.cliente_telefono = ''
    form.value.cliente_email = ''
    alert(error?.data?.message || 'Cliente no encontrado')
  } finally {
    buscandoCliente.value = false
  }
}

const limpiarCliente = () => {
  form.value.clienteId = ''
  form.value.cliente_nombre = ''
  form.value.cliente_telefono = ''
  form.value.cliente_email = ''
  clienteEncontrado.value = false
}

const handleBuscarMaterial = async (id) => {
  buscandoMaterial.value = true
  try {
    const material = await authFetch(`/materiales/${id}`, { method: 'GET' })
    return material
  } catch (error) {
    alert(error?.data?.message || 'Material no encontrado')
    return null
  } finally {
    buscandoMaterial.value = false
  }
}

const handleAgregarMaterial = ({ material, cantidad }) => {
  const materialObj = material.value || material
  const existente = materiales.value.find(
    (item) => item.materialId === materialObj.id
  )

  if (existente) {
    existente.cantidad = Number(existente.cantidad) + Number(cantidad)
    return
  }

  materiales.value.push({
    materialId: materialObj.id,
    nombre: materialObj.nombre,
    cantidad: Number(cantidad),
    precio_unitario: Number(materialObj.precio_unitario || 0),
    unidad_medida: materialObj.unidad_medida
  })
}

const eliminarMaterial = (materialId) => {
  materiales.value = materiales.value.filter((item) => item.materialId !== materialId)
}

const crearCotizacion = async () => {
  if (!form.value.descripcion.trim()) {
    alert('La descripción es obligatoria')
    return
  }

  if (!form.value.tiempo_estimado) {
    alert('El tiempo estimado es obligatorio')
    return
  }

  if (materiales.value.length === 0) {
    alert('Debes agregar al menos un material')
    return
  }

  if (!form.value.clienteId && !form.value.cliente_nombre.trim()) {
    alert('Debes indicar un cliente o escribir el nombre manualmente')
    return
  }

  saving.value = true
  try {
    const payload = {
      clienteId: form.value.clienteId ? Number(form.value.clienteId) : null,
      cliente_nombre: form.value.clienteId ? null : form.value.cliente_nombre,
      cliente_telefono: form.value.clienteId ? null : form.value.cliente_telefono,
      cliente_email: form.value.clienteId ? null : form.value.cliente_email,
      tipo_trabajo: form.value.tipo_trabajo,
      descripcion: form.value.descripcion,
      mano_obra: Number(form.value.mano_obra || 0),
      tiempo_estimado: Number(form.value.tiempo_estimado),
      materiales: materiales.value.map((item) => ({
        materialId: item.materialId,
        cantidad: Number(item.cantidad)
      }))
    }

    const created = await authFetch('/cotizaciones', {
      method: 'POST',
      body: payload
    })

    await navigateTo(`/cotizaciones/${created.id}`)
  } catch (error) {
    alert(
      error?.data?.detalle ||
      error?.data?.message ||
      error?.data?.error ||
      'No se pudo crear la cotización'
    )
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="crear-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Crear cotización</h1>
        <p class="page-subtitle">
          Registra cliente, materiales, mano de obra y total estimado.
        </p>
      </div>

      <div class="header-actions">
        <NuxtLink to="/cotizaciones" class="back-link">
          <v-btn variant="text">Volver</v-btn>
        </NuxtLink>

        <v-btn class="btn-primary" :loading="saving" @click="crearCotizacion">
          Guardar cotización
        </v-btn>
      </div>
    </div>

    <ClienteCotizacionForm
      :form="form"
      :buscando-cliente="buscandoCliente"
      :cliente-encontrado="clienteEncontrado"
      @buscar-cliente="buscarCliente"
      @limpiar-cliente="limpiarCliente"
    />

    <div class="mid-actions">
      <v-btn class="btn-primary" @click="showMaterialDialog = true">
        <v-icon start>mdi-plus</v-icon>
        Buscar y agregar material
      </v-btn>
    </div>

    <MaterialesCotizacionTable
      :items="materiales"
      @eliminar="eliminarMaterial"
    />

    <v-card class="totals-card" elevation="0">
      <h2 class="section-title">Resumen</h2>

      <div class="totals-grid">
        <div class="total-box">
          <span class="total-label">Subtotal materiales</span>
          <span class="total-value">L {{ subtotalMateriales.toFixed(2) }}</span>
        </div>

        <div class="total-box">
          <span class="total-label">Mano de obra</span>
          <span class="total-value">L {{ Number(form.mano_obra || 0).toFixed(2) }}</span>
        </div>

        <div class="total-box total-box-highlight">
          <span class="total-label">Total</span>
          <span class="total-value">L {{ totalCotizacion.toFixed(2) }}</span>
        </div>
      </div>
    </v-card>

    <MaterialSelectorDialog
  v-model="showMaterialDialog"
  :loading="buscandoMaterial"
  :buscar-material-fn="handleBuscarMaterial"
  @agregar="handleAgregarMaterial"
/>
  </div>
</template>

<style scoped>
.crear-page {
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

.mid-actions {
  display: flex;
  justify-content: flex-start;
}

.btn-primary {
  background: #ff6a00 !important;
  color: white !important;
  font-weight: 700;
  border-radius: 12px;
}

.totals-card {
  background: linear-gradient(180deg, #0f1c2b 0%, #132238 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 18px;
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

@media (max-width: 900px) {
  .totals-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>