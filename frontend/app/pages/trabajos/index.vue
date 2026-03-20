<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import TrabajoCard from '../../components/trabajos/TrabajoCard.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const { authFetch } = useAuth()

const loading = ref(false)
const trabajos = ref([])
const filtroEstado = ref('en_proceso')

const tabs = [
  { label: 'En proceso', value: 'en_proceso' },
  { label: 'Finalizados', value: 'finalizado' },
  { label: 'Cancelados', value: 'cancelado' }
]

const filteredTrabajos = computed(() => {
  return trabajos.value.filter((item) => item.estado === filtroEstado.value)
})

const cargarTrabajos = async () => {
  loading.value = true
  try {
    const response = await authFetch('/trabajos', {
      method: 'GET'
    })

    trabajos.value = Array.isArray(response) ? response : []
    console.log('Trabajos cargados:', trabajos.value)
  } catch (error) {
    console.error('Error cargando trabajos:', error)
    alert(
      error?.data?.message ||
      error?.data?.error ||
      'No se pudieron cargar los trabajos'
    )
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await cargarTrabajos()
})
</script>

<template>
  <div class="trabajos-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Trabajos</h1>
        <p class="page-subtitle">
          Consulta los trabajos por estado y accede a su detalle.
        </p>
      </div>

      <NuxtLink to="/trabajos/crear" class="create-link">
        <v-btn class="btn-primary" size="large">
          <v-icon start>mdi-briefcase-plus-outline</v-icon>
          Nuevo trabajo
        </v-btn>
      </NuxtLink>
    </div>

    <v-card class="toolbar-card" elevation="0">
      <div class="toolbar-content">
        <div class="filter-group">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            class="filter-btn"
            :class="{ active: filtroEstado === tab.value }"
            @click="filtroEstado = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </v-card>

    <div v-if="loading" class="loading-box">
      <v-progress-circular indeterminate color="deep-orange" />
      <span>Cargando trabajos...</span>
    </div>

    <div v-else-if="filteredTrabajos.length" class="cards-grid">
      <TrabajoCard
        v-for="trabajo in filteredTrabajos"
        :key="trabajo.id"
        :trabajo="trabajo"
      />
    </div>

    <v-card v-else class="empty-card" elevation="0">
      <div class="empty-content">
        <v-icon size="48" class="empty-icon">
          mdi-briefcase-outline
        </v-icon>
        <h3>No hay trabajos en esta categoría</h3>
        <p>
          Cuando existan trabajos con ese estado aparecerán aquí.
        </p>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.trabajos-page {
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

.create-link {
  text-decoration: none;
}

.btn-primary {
  background: #ff6a00 !important;
  color: white !important;
  font-weight: 700;
  border-radius: 12px;
}

.toolbar-card,
.empty-card {
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
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.filter-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #dbe6f3;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.2s ease;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.06);
}

.filter-btn.active {
  background: rgba(255, 106, 0, 0.16);
  border-color: rgba(255, 106, 0, 0.5);
  color: #ff9f4a;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(320px, 1fr));
  gap: 18px;
}

.loading-box,
.empty-content {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 14px;
  text-align: center;
  color: white;
}

.empty-card {
  padding: 22px;
}

.empty-icon {
  color: #ff8a2a;
}

.empty-content h3 {
  margin: 0;
  font-size: 1.2rem;
  color: white;
}

.empty-content p {
  margin: 0;
  color: #aab6c9;
}

@media (max-width: 900px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    align-items: stretch;
  }
}
</style>