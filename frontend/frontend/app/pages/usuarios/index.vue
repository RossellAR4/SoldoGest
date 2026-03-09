<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

definePageMeta({
  middleware: 'auth'
})

const { getUser, authFetch } = useAuth()
const currentUser = computed(() => getUser() || {})

const loading = ref(false)
const usuarios = ref([])
const search = ref('')

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)

const saving = ref(false)
const deleting = ref(false)

const selectedUser = ref(null)

const createForm = ref({
  nombre: '',
  email: '',
  password: '',
  rol: 'empleado'
})

const editForm = ref({
  id: null,
  nombre: '',
  email: '',
  rol: 'empleado'
})

const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Email', key: 'email' },
  { title: 'Rol', key: 'rol', sortable: false },
  { title: 'Acciones', key: 'acciones', sortable: false, align: 'end' }
]

const filteredUsuarios = computed(() => {
  const term = search.value.trim().toLowerCase()

  if (!term) return usuarios.value

  return usuarios.value.filter((u) => {
    return (
      (u.nombre || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.rol || '').toLowerCase().includes(term)
    )
  })
})

const resetCreateForm = () => {
  createForm.value = {
    nombre: '',
    email: '',
    password: '',
    rol: 'empleado'
  }
}

const openCreateDialog = () => {
  resetCreateForm()
  showCreateDialog.value = true
}

const openEditDialog = (user) => {
  editForm.value = {
    id: user.id,
    nombre: user.nombre || '',
    email: user.email || '',
    rol: user.rol || 'empleado'
  }
  showEditDialog.value = true
}

const openDeleteDialog = (user) => {
  selectedUser.value = user
  showDeleteDialog.value = true
}

const cargarUsuarios = async () => {
  loading.value = true
  try {
    const response = await authFetch('/usuarios', {
      method: 'GET'
    })
    usuarios.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Error cargando usuarios:', error)
  } finally {
    loading.value = false
  }
}

const crearUsuario = async () => {
  saving.value = true
  try {
    await authFetch('/usuarios', {
      method: 'POST',
      body: createForm.value
    })

    showCreateDialog.value = false
    await cargarUsuarios()
    resetCreateForm()
  } catch (error) {
    console.error('Error creando usuario:', error)
    alert(
      error?.data?.errors?.[0]?.msg ||
      error?.data?.message ||
      error?.data?.error ||
      'No se pudo crear el usuario'
    )
  } finally {
    saving.value = false
  }
}

/*
  IMPORTANTE:
  Tu backend actual NO tiene ruta para editar usuario.
  Este método queda listo para cuando agregues:
  PUT /usuarios/:id  o  PATCH /usuarios/:id
*/
const guardarEdicion = async () => {
  saving.value = true
  try {
    await authFetch(`/usuarios/${editForm.value.id}`, {
      method: 'PUT',
      body: {
        nombre: editForm.value.nombre,
        email: editForm.value.email,
        rol: editForm.value.rol
      }
    })

    showEditDialog.value = false
    await cargarUsuarios()
  } catch (error) {
    console.error('Error editando usuario:', error)
    alert(
      error?.data?.message ||
      'Tu backend aún no tiene ruta para editar usuarios.'
    )
  } finally {
    saving.value = false
  }
}

const inhabilitarUsuario = async () => {
  if (!selectedUser.value) return

  deleting.value = true
  try {
    await authFetch(`/usuarios/${selectedUser.value.id}`, {
      method: 'DELETE'
    })

    showDeleteDialog.value = false
    selectedUser.value = null
    await cargarUsuarios()
  } catch (error) {
    console.error('Error inhabilitando usuario:', error)
    alert(
      error?.data?.message ||
      'No se pudo inhabilitar el usuario'
    )
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  if (currentUser.value?.rol !== 'admin') {
    await navigateTo('/')
    return
  }

  await cargarUsuarios()
})
</script>

<template>
  <div class="usuarios-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Gestión de usuarios</h1>
        <p class="page-subtitle">
          Administra usuarios del sistema, roles y accesos.
        </p>
      </div>

      <v-btn class="btn-primary" size="large" @click="openCreateDialog">
        <v-icon start>mdi-account-plus</v-icon>
        Nuevo usuario
      </v-btn>
    </div>

    <v-card class="toolbar-card" elevation="0">
      <div class="toolbar-content">
        <v-text-field
          v-model="search"
          label="Buscar por nombre, email o rol"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          density="comfortable"
          hide-details
          class="search-field"
        />
      </div>
    </v-card>

    <v-card class="table-card" elevation="0">
      <v-data-table
        :headers="headers"
        :items="filteredUsuarios"
        :loading="loading"
        items-per-page="8"
        class="usuarios-table"
      >
        <template #item.rol="{ item }">
          <v-chip
            :color="item.rol === 'admin' ? 'deep-orange' : 'blue-grey'"
            variant="flat"
            size="small"
            class="role-chip"
          >
            {{ item.rol }}
          </v-chip>
        </template>

        <template #item.acciones="{ item }">
          <div class="actions-cell">
            <v-tooltip text="Editar usuario">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  variant="text"
                  size="small"
                  class="action-btn action-edit"
                  @click="openEditDialog(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Inhabilitar usuario">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  variant="text"
                  size="small"
                  class="action-btn action-delete"
                  @click="openDeleteDialog(item)"
                >
                  <v-icon>mdi-account-off</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>

        <template #bottom>
          <div class="table-footer">
            <span class="footer-text">Paginación automática habilitada</span>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal crear -->
    <v-dialog v-model="showCreateDialog" max-width="620">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          Crear usuario
        </v-card-title>

        <v-card-text>
          <div class="dialog-grid">
            <v-text-field
              v-model="createForm.nombre"
              label="Nombre"
              variant="outlined"
            />

            <v-text-field
              v-model="createForm.email"
              label="Email"
              variant="outlined"
            />

            <v-text-field
              v-model="createForm.password"
              label="Contraseña"
              type="password"
              variant="outlined"
            />

            <v-select
              v-model="createForm.rol"
              :items="['admin', 'empleado']"
              label="Rol"
              variant="outlined"
            />
          </div>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-btn variant="text" @click="showCreateDialog = false">
            Cancelar
          </v-btn>
          <v-btn class="btn-primary" :loading="saving" @click="crearUsuario">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal editar -->
    <v-dialog v-model="showEditDialog" max-width="620">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          Editar usuario
        </v-card-title>

        <v-card-text>
          <div class="dialog-grid">
            <v-text-field
              v-model="editForm.nombre"
              label="Nombre"
              variant="outlined"
            />

            <v-text-field
              v-model="editForm.email"
              label="Email"
              variant="outlined"
            />

            <v-select
              v-model="editForm.rol"
              :items="['admin', 'empleado']"
              label="Rol"
              variant="outlined"
            />
          </div>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-btn variant="text" @click="showEditDialog = false">
            Cancelar
          </v-btn>
          <v-btn class="btn-primary" :loading="saving" @click="guardarEdicion">
            Guardar cambios
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm dialog inhabilitar -->
    <v-dialog v-model="showDeleteDialog" max-width="520">
      <v-card class="dialog-card confirm-card">
        <v-card-title class="dialog-title">
          Inhabilitar usuario
        </v-card-title>

        <v-card-text class="confirm-text">
          ¿Deseas inhabilitar a
          <strong>{{ selectedUser?.nombre }}</strong>?
          Esta acción ocultará el usuario de los listados activos.
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-btn variant="text" @click="showDeleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn
            color="deep-orange"
            variant="flat"
            :loading="deleting"
            @click="inhabilitarUsuario"
          >
            Inhabilitar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.usuarios-page {
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

.toolbar-card,
.table-card,
.dialog-card {
  background: linear-gradient(180deg, #0f1c2b 0%, #132238 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
}

.toolbar-card {
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

.table-card {
  padding: 8px 10px;
}

:deep(.usuarios-table) {
  background: transparent;
  color: white;
}

:deep(.usuarios-table .v-data-table-header__content) {
  font-weight: 800;
  color: #dfe7f4;
}

:deep(.usuarios-table .v-table__wrapper > table > tbody > tr:hover) {
  background: rgba(255, 255, 255, 0.03);
}

:deep(.usuarios-table .v-data-table-footer) {
  color: #dfe7f4;
}

:deep(.v-field) {
  background: rgba(8, 18, 31, 0.9);
  border-radius: 12px;
}

.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.action-btn {
  border-radius: 10px;
}

.action-edit {
  color: #4fc3f7;
}

.action-delete {
  color: #ff8a65;
}

.role-chip {
  font-weight: 700;
  text-transform: capitalize;
}

.dialog-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
  padding-top: 22px;
}

.dialog-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 10px;
}

.dialog-actions {
  padding: 16px 24px 22px;
  justify-content: flex-end;
}

.confirm-card {
  border: 1px solid rgba(255, 106, 0, 0.25);
}

.confirm-text {
  color: #dbe4f2;
  line-height: 1.6;
}

.table-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 10px 6px 4px;
}

.footer-text {
  color: #96a4bc;
  font-size: 0.9rem;
}

@media (max-width: 800px) {
  .dialog-grid {
    grid-template-columns: 1fr;
  }

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