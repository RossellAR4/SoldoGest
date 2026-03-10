<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuth } from '../../composables/useAuth'
import ClienteFormDialog from '../../components/clientes/ClienteFormDialog.vue'
import ClienteDeleteDialog from '../../components/clientes/ClienteDeleteDialog.vue'
import ClientesTable from '../../components/clientes/ClientesTable.vue'
definePageMeta({
  middleware: 'auth'
})

const { getUser, authFetch } = useAuth()

const currentUser = computed(() => getUser() || {})
const isAdmin = computed(() => currentUser.value?.rol === 'admin')

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)

const clientes = ref([])
const search = ref('')

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)

const selectedCliente = ref(null)

const createForm = ref({
  nombre: '',
  telefono: '',
  direccion: '',
  email: ''
})

const editForm = ref({
  id: null,
  nombre: '',
  telefono: '',
  direccion: '',
  email: ''
})

const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Teléfono', key: 'telefono' },
  { title: 'Dirección', key: 'direccion' },
  { title: 'Email', key: 'email' },
  { title: 'Acciones', key: 'acciones', sortable: false, align: 'end' }
]

const filteredClientes = computed(() => {
  const term = search.value.trim().toLowerCase()

  if (!term) return clientes.value

  return clientes.value.filter((cliente) => (
    (cliente.nombre || '').toLowerCase().includes(term) ||
    (cliente.telefono || '').toLowerCase().includes(term) ||
    (cliente.direccion || '').toLowerCase().includes(term) ||
    (cliente.email || '').toLowerCase().includes(term)
  ))
})

const resetCreateForm = () => {
  createForm.value = {
    nombre: '',
    telefono: '',
    direccion: '',
    email: ''
  }
}

const resetEditForm = () => {
  editForm.value = {
    id: null,
    nombre: '',
    telefono: '',
    direccion: '',
    email: ''
  }
}

const openCreateDialog = () => {
  resetCreateForm()
  showCreateDialog.value = true
}

const openEditDialog = (cliente) => {
    console.log('abriendo dialog'),
  editForm.value = {
    id: cliente.id,
    nombre: cliente.nombre || '',
    telefono: cliente.telefono || '',
    direccion: cliente.direccion || '',
    email: cliente.email || ''
  }
  showEditDialog.value = true
}

const openDeleteDialog = (cliente) => {
  selectedCliente.value = cliente
  showDeleteDialog.value = true
}

const cargarClientes = async () => {
  loading.value = true
  try {
    const response = await authFetch('/clientes', { method: 'GET' })
    clientes.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Error cargando clientes:', error)
    alert(error?.data?.message || 'No se pudieron cargar los clientes')
  } finally {
    loading.value = false
  }
}

const crearCliente = async () => {
  if (!createForm.value.nombre.trim()) {
    alert('El nombre es obligatorio')
    return
  }

  if (!createForm.value.telefono.trim()) {
    alert('El teléfono es obligatorio')
    return
  }

  saving.value = true
  try {
    await authFetch('/clientes', {
      method: 'POST',
      body: { ...createForm.value }
    })

    showCreateDialog.value = false
    await cargarClientes()
  } catch (error) {
    console.error('Error creando cliente:', error)
    alert(
      error?.data?.errors?.[0]?.msg ||
      error?.data?.message ||
      error?.data?.error ||
      'No se pudo crear el cliente'
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

  if (!editForm.value.telefono.trim()) {
    alert('El teléfono es obligatorio')
    return
  }

  saving.value = true
  try {
    await authFetch(`/clientes/${editForm.value.id}`, {
      method: 'PUT',
      body: {
        nombre: editForm.value.nombre,
        telefono: editForm.value.telefono,
        direccion: editForm.value.direccion,
        email: editForm.value.email
      }
    })

    showEditDialog.value = false
    await cargarClientes()
  } catch (error) {
    console.error('Error editando cliente:', error)
    alert(
      error?.data?.errors?.[0]?.msg ||
      error?.data?.message ||
      error?.data?.error ||
      'No se pudo actualizar el cliente'
    )
  } finally {
    saving.value = false
  }
}

const inhabilitarCliente = async () => {
  if (!selectedCliente.value) return

  deleting.value = true
  try {
    await authFetch(`/clientes/${selectedCliente.value.id}`, {
      method: 'DELETE'
    })

    showDeleteDialog.value = false
    await cargarClientes()
  } catch (error) {
    console.error('Error inhabilitando cliente:', error)
    alert(
      error?.data?.message ||
      error?.data?.error ||
      'No se pudo inhabilitar el cliente'
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
  if (!value) selectedCliente.value = null
})

onMounted(async () => {
  await cargarClientes()
})
</script>

<template>
  <div class="clientes-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Gestión de clientes</h1>
        <p class="page-subtitle">
          Registra, consulta y actualiza los clientes del sistema.
        </p>
      </div>

      <v-btn class="btn-primary" size="large" @click="openCreateDialog">
        <v-icon start>mdi-account-plus</v-icon>
        Nuevo cliente
      </v-btn>
    </div>

    <v-card class="toolbar-card" elevation="0">
      <div class="toolbar-content">
        <v-text-field
          v-model="search"
          label="Buscar por nombre, teléfono, dirección o email"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          density="comfortable"
          hide-details
          class="search-field"
        />
      </div>
    </v-card>

    <ClientesTable
      :headers="headers"
      :items="filteredClientes"
      :loading="loading"
      :is-admin="isAdmin"
      @editar="openEditDialog"
      @inhabilitar="openDeleteDialog"
    />

    <ClienteFormDialog
      v-model="showCreateDialog"
      :form="createForm"
      :saving="saving"
      modo="crear"
      @guardar="crearCliente"
    />

    <ClienteFormDialog
      v-model="showEditDialog"
      :form="editForm"
      :saving="saving"
      modo="editar"
      @guardar="guardarEdicion"
    />

    <ClienteDeleteDialog
      v-model="showDeleteDialog"
      :cliente="selectedCliente"
      :deleting="deleting"
      @confirmar="inhabilitarCliente"
    />
  </div>
</template>

<style scoped>
.clientes-page {
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
  max-width: 460px;
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