<script setup>
defineProps({
  form: {
    type: Object,
    required: true
  },
  buscandoCliente: {
    type: Boolean,
    default: false
  },
  clienteEncontrado: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['buscar-cliente', 'limpiar-cliente'])
</script>

<template>
  <v-card class="section-card" elevation="0">
    <div class="section-header">
      <div>
        <h2 class="section-title">Cliente</h2>
        <p class="section-subtitle">
          Puedes buscar por ID o ingresar los datos manualmente.
        </p>
      </div>
    </div>

    <div class="form-grid">
      <div class="client-id-row">
        <v-text-field
          v-model="form.clienteId"
          label="ID del cliente"
          type="number"
          variant="outlined"
          hide-details
        />

        <v-btn
          class="btn-secondary"
          :loading="buscandoCliente"
          @click="emit('buscar-cliente')"
        >
          Buscar
        </v-btn>

        <v-btn
          variant="text"
          class="btn-clear"
          @click="emit('limpiar-cliente')"
        >
          Manual
        </v-btn>
      </div>

      <v-text-field
        v-model="form.cliente_nombre"
        label="Nombre del cliente"
        variant="outlined"
        :readonly="clienteEncontrado"
      />

      <v-text-field
        v-model="form.cliente_telefono"
        label="Teléfono"
        variant="outlined"
        :readonly="clienteEncontrado"
      />

      <v-text-field
        v-model="form.cliente_email"
        label="Email"
        variant="outlined"
        :readonly="clienteEncontrado"
      />

      <v-text-field
        v-model="form.tipo_trabajo"
        label="Tipo de trabajo"
        variant="outlined"
      />

      <v-textarea
        v-model="form.descripcion"
        label="Descripción"
        variant="outlined"
        rows="4"
      />

      <v-text-field
        v-model="form.tiempo_estimado"
        label="Tiempo estimado (días)"
        type="number"
        variant="outlined"
      />

      <v-text-field
        v-model="form.mano_obra"
        label="Mano de obra"
        type="number"
        variant="outlined"
        prefix="L"
      />
    </div>

    <div v-if="clienteEncontrado" class="info-banner">
      Cliente encontrado y datos autocompletados.
    </div>
  </v-card>
</template>

<style scoped>
.section-card {
  background: linear-gradient(180deg, #0f1c2b 0%, #132238 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 18px;
}

.section-header {
  margin-bottom: 18px;
}

.section-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
}

.section-subtitle {
  margin: 6px 0 0 0;
  color: #aab6c9;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.client-id-row {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08) !important;
  color: white !important;
  border-radius: 12px;
}

.btn-clear {
  color: #ff9f4a !important;
}

.info-banner {
  margin-top: 14px;
  background: rgba(255, 106, 0, 0.12);
  color: #ffb36f;
  border: 1px solid rgba(255, 106, 0, 0.3);
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 600;
}

:deep(.v-field) {
  background: rgba(8, 18, 31, 0.9);
  border-radius: 12px;
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .client-id-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>