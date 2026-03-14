<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  form: {
    type: Object,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  },
  modo: {
    type: String,
    default: 'crear'
  }
})

const emit = defineEmits(['update:modelValue', 'guardar'])

const dialogTitle = computed(() =>
  props.modo === 'editar' ? 'Editar material' : 'Nuevo material'
)

const buttonText = computed(() =>
  props.modo === 'editar' ? 'Guardar cambios' : 'Guardar'
)

const categorias = [
  'perfil_estructural',
  'lamina',
  'consumible',
  'acabado',
  'accesorio',
  'otro'
]

const unidades = [
  'unidad',
  'metro',
  'pie',
  'libra',
  'kilogramo',
  'galon',
  'litro',
  'paquete'
]

const closeDialog = () => {
  emit('update:modelValue', false)
}

const submitForm = () => {
  emit('guardar')
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="900"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="dialog-card">
      <v-card-title class="dialog-title">
        {{ dialogTitle }}
      </v-card-title>

      <v-card-text>
        <div class="dialog-grid">
          <v-text-field
            v-model="form.nombre"
            label="Nombre"
            variant="outlined"
          />

          <v-select
            v-model="form.categoria"
            :items="categorias"
            label="Categoría"
            variant="outlined"
          />

          <v-text-field
            v-model="form.tipo"
            label="Tipo"
            variant="outlined"
          />

          <v-select
            v-model="form.unidad_medida"
            :items="unidades"
            label="Unidad de medida"
            variant="outlined"
          />

          <v-text-field
            v-model="form.precio_unitario"
            label="Precio unitario"
            type="number"
            variant="outlined"
          />

          <v-text-field
            v-model="form.stock"
            label="Stock"
            type="number"
            variant="outlined"
          />

          <v-text-field
            v-model="form.largo"
            label="Largo"
            type="number"
            variant="outlined"
          />

          <v-text-field
            v-model="form.ancho"
            label="Ancho"
            type="number"
            variant="outlined"
          />

          <v-text-field
            v-model="form.alto"
            label="Alto"
            type="number"
            variant="outlined"
          />

          <v-text-field
            v-model="form.grosor"
            label="Grosor"
            type="number"
            variant="outlined"
          />

          <v-text-field
            v-model="form.diametro"
            label="Diámetro"
            type="number"
            variant="outlined"
          />

          <v-text-field
            v-model="form.descripcion"
            label="Descripción"
            variant="outlined"
          />
        </div>
      </v-card-text>

      <v-card-actions class="dialog-actions">
        <v-btn variant="text" @click="closeDialog">
          Cancelar
        </v-btn>

        <v-btn class="btn-primary" :loading="saving" @click="submitForm">
          {{ buttonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dialog-card {
  background: linear-gradient(180deg, #0f1c2b 0%, #132238 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
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

.btn-primary {
  background: #ff6a00 !important;
  color: white !important;
  font-weight: 700;
  border-radius: 12px;
}

:deep(.v-field) {
  background: rgba(8, 18, 31, 0.9);
  border-radius: 12px;
}

@media (max-width: 800px) {
  .dialog-grid {
    grid-template-columns: 1fr;
  }
}
</style>