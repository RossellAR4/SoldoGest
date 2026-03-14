<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuth } from '../../composables/useAuth'
import MaterialFormDialog from '../../components/materiales/MaterialFormDialog.vue'
import MaterialDeleteDialog from '../../components/materiales/MaterialDeleteDialog.vue'
import MaterialesTable from '../../components/materiales/MaterialesTable.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const { getUser, authFetch } = useAuth()

const currentUser = computed(() => getUser() || {})
const isAdmin = computed(() => currentUser.value?.rol === 'admin')

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)

const materiales = ref([])
const search = ref('')

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)

const selectedMaterial = ref(null)

const initialForm = () => ({
  nombre: '',
  categoria: 'otro',
  tipo: '',
  precio_unitario: '',
  stock: '',
  unidad_medida: 'unidad',
  largo: '',
  ancho: '',
  alto: '',
  grosor: '',
  diametro: '',
  descripcion: ''
})

const createForm = ref(initialForm())
const editForm = ref({ id: null, ...initialForm() })

const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Categoría', key: 'categoria' },
  { title: 'Tipo', key: 'tipo' },
  { title: 'Unidad', key: 'unidad_medida' },
    { title: 'Largo', key: 'largo' },
  { title: 'Precio', key: 'precio_unitario' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Acciones', key: 'acciones', sortable: false, align: 'end' }
]

const filteredMateriales = computed(() => {
  const term = search.value.trim().toLowerCase()

  if (!term) return materiales.value

  return materiales.value.filter((material) => (
    (material.nombre || '').toLowerCase().includes(term) ||
    (material.categoria || '').toLowerCase().includes(term) ||
    (material.tipo || '').toLowerCase().includes(term) ||
    (material.unidad_medida || '').toLowerCase().includes(term) ||
    (material.descripcion || '').toLowerCase().includes(term)
  ))
})

const normalizeNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null
  return Number(value)
}

const buildPayload = (form) => ({
  nombre: form.nombre,
  categoria: form.categoria,
  tipo: form.tipo,
  precio_unitario: normalizeNumber(form.precio_unitario),
  stock: normalizeNumber(form.stock) ?? 0,
  unidad_medida: form.unidad_medida,
  largo: normalizeNumber(form.largo),
  ancho: normalizeNumber(form.ancho),
  alto: normalizeNumber(form.alto),
  grosor: normalizeNumber(form.grosor),
  diametro: normalizeNumber(form.diametro),
  descripcion: form.descripcion || null
})

const resetCreateForm = () => {
  createForm.value = initialForm()
}

const resetEditForm = () => {
  editForm.value = { id: null, ...initialForm() }
}

const openCreateDialog = () => {
  resetCreateForm()
  showCreateDialog.value = true
}

const openEditDialog = (material) => {
  editForm.value = {
    id: material.id,
    nombre: material.nombre || '',
    categoria: material.categoria || 'otro',
    tipo: material.tipo || '',
    precio_unitario: material.precio_unitario || '',
    stock: material.stock || '',
    unidad_medida: material.unidad_medida || 'unidad',
    largo: material.largo || '',
    ancho: material.ancho || '',
    alto: material.alto || '',
    grosor: material.grosor || '',
    diametro: material.diametro || '',
    descripcion: material.descripcion || ''
  }

  showEditDialog.value = true
}

const openDeleteDialog = (material) => {
  selectedMaterial.value = material
  showDeleteDialog.value = true
}

const cargarMateriales = async () => {
  loading.value = true
  try {
    const response = await authFetch('/materiales', {
      method: 'GET'
    })

    materiales.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Error cargando materiales:', error)
    alert(error?.data?.message || 'No se pudieron cargar los materiales')
  } finally {
    loading.value = false
  }
}

const crearMaterial = async () => {
  if (!createForm.value.nombre.trim()) {
    alert('El nombre es obligatorio')
    return
  }

  if (!createForm.value.tipo.trim()) {
    alert('El tipo es obligatorio')
    return
  }

  if (createForm.value.precio_unitario === '' || createForm.value.precio_unitario === null) {
    alert('El precio unitario es obligatorio')
    return
  }

  saving.value = true
  try {
    await authFetch('/materiales', {
      method: 'POST',
      body: buildPayload(createForm.value)
    })

    showCreateDialog.value = false
    await cargarMateriales()
  } catch (error) {
    console.error('Error creando material:', error)
    alert(
      error?.data?.errors?.[0]?.msg ||
      error?.data?.message ||
      error?.data?.error ||
      'No se pudo crear el material'
    )
  } finally {
    saving.value = false
  }
}

const guardarEdicion = async () => {
  if (!editForm.value.nombre.trim()) {
    alert('El nombre es obligatorio')
    return
  }

  if (!editForm.value.tipo.trim()) {
    alert('El tipo es obligatorio')
    return
  }

  if (editForm.value.precio_unitario === '' || editForm.value.precio_unitario === null) {
    alert('El precio unitario es obligatorio')
    return
  }

  saving.value = true
  try {
    await authFetch(`/materiales/${editForm.value.id}`, {
      method: 'PUT',
      body: buildPayload(editForm.value)
    })

    showEditDialog.value = false
    await cargarMateriales()
  } catch (error) {
    console.error('Error editando material:', error)
    alert(
      error?.data?.errors?.[0]?.msg ||
      error?.data?.message ||
      error?.data?.error ||
      'No se pudo actualizar el material'
    )
  } finally {
    saving.value = false
  }
}

const inhabilitarMaterial = async () => {
  if (!selectedMaterial.value) return

  deleting.value = true
  try {
    await authFetch(`/materiales/${selectedMaterial.value.id}`, {
      method: 'DELETE'
    })

    showDeleteDialog.value = false
    await cargarMateriales()
  } catch (error) {
    console.error('Error inhabilitando material:', error)
    alert(
      error?.data?.message ||
      error?.data?.error ||
      'No se pudo inhabilitar el material'
    )
  } finally {
    deleting.value = false
  }
}

watch(showCreateDialog, (value) => {
  if (!value) resetCreateForm()
})

watch(showEditDialog, (value) => {
  if (!value) resetEditForm()
})

watch(showDeleteDialog, (value) => {
  if (!value) selectedMaterial.value = null
})

onMounted(async () => {
  await cargarMateriales()
})
</script>

<template>
  <div class="materiales-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Gestión de materiales</h1>
        <p class="page-subtitle">
          Consulta inventario, dimensiones, consumibles y costos.
        </p>
      </div>

      <v-btn
        v-if="isAdmin"
        class="btn-primary"
        size="large"
        @click="openCreateDialog"
      >
        <v-icon start>mdi-package-variant-plus</v-icon>
        Nuevo material
      </v-btn>
    </div>

    <v-card class="toolbar-card" elevation="0">
      <div class="toolbar-content">
        <v-text-field
          v-model="search"
          label="Buscar por nombre, categoría, tipo, unidad o descripción"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          density="comfortable"
          hide-details
          class="search-field"
        />
      </div>
    </v-card>

    <MaterialesTable
      :headers="headers"
      :items="filteredMateriales"
      :loading="loading"
      :is-admin="isAdmin"
      @editar="openEditDialog"
      @inhabilitar="openDeleteDialog"
    />

    <MaterialFormDialog
      v-model="showCreateDialog"
      :form="createForm"
      :saving="saving"
      modo="crear"
      @guardar="crearMaterial"
    />

    <MaterialFormDialog
      v-model="showEditDialog"
      :form="editForm"
      :saving="saving"
      modo="editar"
      @guardar="guardarEdicion"
    />

    <MaterialDeleteDialog
      v-model="showDeleteDialog"
      :material="selectedMaterial"
      :deleting="deleting"
      @confirmar="inhabilitarMaterial"
    />
  </div>
</template>

<style scoped>
.materiales-page {
  color: white;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  color: #ffffff;
}

.page-subtitle {
  margin: 6px 0 0 0;
  color: #aab6c9;
}

.btn-primary {
  background: #ff6a00 !important;
  color: white !important;
  font-weight: 700;
  border-radius: 12px;
}

.toolbar-card {
  background: linear-gradient(180deg, #0f1c2b 0%, #132238 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  margin-bottom: 18px;
  padding: 16px;
}

.toolbar-content {
  display: flex;
  gap: 14px;
  align-items: center;
}

.search-field {
  max-width: 540px;
}

@media (max-width: 800px) {
  .search-field {
    max-width: 100%;
    width: 100%;
  }

  .toolbar-content {
    flex-direction: column;
    align-items: stretch;
  }

  .page-header {
    align-items: stretch;
  }
}
</style>