<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['eliminar'])

const subtotal = (item) => {
  const cantidad = Number(item.cantidad || 0)
  const precio = Number(item.precio_unitario || 0)
  return (cantidad * precio).toFixed(2)
}
</script>

<template>
  <v-card class="table-card" elevation="0">
    <div class="table-header">
      <h2 class="section-title">Materiales</h2>
    </div>

    <div v-if="items.length" class="table-wrapper">
      <table class="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Material</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th v-if="!readOnly">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in items" :key="`${item.materialId}-${item.nombre}`">
            <td>{{ item.materialId }}</td>
            <td>{{ item.nombre }}</td>
            <td>{{ item.cantidad }}</td>
            <td>L {{ Number(item.precio_unitario || 0).toFixed(2) }}</td>
            <td>L {{ subtotal(item) }}</td>
            <td v-if="!readOnly">
              <v-btn
                icon
                variant="text"
                size="small"
                class="action-delete"
                @click="emit('eliminar', item.materialId)"
              >
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty-box">
      No hay materiales agregados.
    </div>
  </v-card>
</template>

<style scoped>
.table-card {
  background: linear-gradient(180deg, #0f1c2b 0%, #132238 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 18px;
}

.table-header {
  margin-bottom: 14px;
}

.section-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
}

.table-wrapper {
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  color: white;
}

.custom-table th,
.custom-table td {
  padding: 12px 10px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.custom-table th {
  color: #dfe7f4;
  font-weight: 800;
}

.custom-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.action-delete {
  color: #ff8a65;
}

.empty-box {
  color: #aab6c9;
  padding: 20px 0;
}
</style>