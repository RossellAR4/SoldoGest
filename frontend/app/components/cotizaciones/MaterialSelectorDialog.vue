<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  buscarMaterialFn: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'agregar'])

const materialId = ref('')
const cantidad = ref('1')
const material = ref(null)

const closeDialog = () => {
  emit('update:modelValue', false)
  materialId.value = ''
  cantidad.value = '1'
  material.value = null
}

const buscarMaterial = async () => {
  if (!materialId.value) return

  const result = await props.buscarMaterialFn(Number(materialId.value))

  if (result) {
    material.value = result
  } else {
    material.value = null
  }
}

const agregarMaterial = () => {
  if (!material.value || !cantidad.value) return

  emit('agregar', {
    material: material.value,
    cantidad: Number(cantidad.value)
  })

  materialId.value = ''
  cantidad.value = '1'
  material.value = null
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="700"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="dialog-card">
      <v-card-title class="dialog-title">
        Buscar y agregar material
      </v-card-title>

      <v-card-text>
        <div class="dialog-grid">
          <v-text-field
            v-model="materialId"
            label="ID del material"
            type="number"
            variant="outlined"
          />

          <v-text-field
            v-model="cantidad"
            label="Cantidad"
            type="number"
            variant="outlined"
          />
        </div>

        <div class="dialog-actions-top">
          <v-btn class="btn-secondary" :loading="loading" @click="buscarMaterial">
            Buscar material
          </v-btn>
        </div>

        <div v-if="material" class="material-preview">
          <div><strong>Nombre:</strong> {{ material.nombre }}</div>
          <div><strong>Tipo:</strong> {{ material.tipo }}</div>
          <div><strong>Unidad:</strong> {{ material.unidad_medida }}</div>
          <div><strong>Precio:</strong> L {{ Number(material.precio_unitario || 0).toFixed(2) }}</div>
        </div>
      </v-card-text>

      <v-card-actions class="dialog-actions">
        <v-btn variant="text" @click="closeDialog">
          Cancelar
        </v-btn>

        <v-btn class="btn-primary" :disabled="!material" @click="agregarMaterial">
          Agregar
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
}

.dialog-actions-top {
  margin-top: 12px;
}

.material-preview {
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 14px;
  padding: 14px;
  color: #dfe7f4;
  display: grid;
  gap: 8px;
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

.btn-secondary {
  background: rgba(255, 255, 255, 0.08) !important;
  color: white !important;
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