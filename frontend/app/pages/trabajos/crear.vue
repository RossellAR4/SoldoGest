<script setup>
import { onMounted, ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import TrabajoForm from '../../components/trabajos/TrabajoForm.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const { authFetch } = useAuth()

const clientes = ref([])
const loading = ref(false)

const cargarClientes = async () => {
  try {
    const response = await authFetch('/clientes', {
      method: 'GET'
    })
    clientes.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Error cargando clientes:', error)
    alert('No se pudieron cargar los clientes')
  }
}

const guardarTrabajo = async (data) => {
  loading.value = true
  try {
    await authFetch('/trabajos', {
      method: 'POST',
      body: data
    })

    alert('Trabajo creado correctamente')
    await navigateTo('/trabajos')
  } catch (error) {
    console.error('Error creando trabajo:', error)
    alert(
      error?.data?.detalle ||
      error?.data?.message ||
      'No se pudo crear el trabajo'
    )
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await cargarClientes()
})
</script>

<template>
  <div class="crear-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Crear trabajo</h1>
        <p class="page-subtitle">
          Registra un nuevo trabajo manual en el sistema.
        </p>
      </div>
    </div>

    <TrabajoForm
      :clientes="clientes"
      :loading="loading"
      @submit="guardarTrabajo"
    />
  </div>
</template>

<style scoped>
.crear-page {
  color: white;
}

.page-header {
  margin-bottom: 20px;
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
</style>