<script setup>
defineProps({
  headers: {
    type: Array,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['editar', 'inhabilitar'])
</script>

<template>
  <v-card class="table-card" elevation="0">
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      items-per-page="8"
      class="materiales-table"
    >
      <template #item.precio_unitario="{ item }">
        <span>L {{ item.precio_unitario }}</span>
      </template>

      <template #item.descripcion="{ item }">
        <span>{{ item.descripcion || '—' }}</span>
      </template>

      <template #item.acciones="{ item }">
        <div class="actions-cell">
          <v-tooltip v-if="isAdmin" text="Editar material">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                variant="text"
                size="small"
                class="action-btn action-edit"
                @click="emit('editar', item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip v-if="isAdmin" text="Inhabilitar material">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                variant="text"
                size="small"
                class="action-btn action-delete"
                @click="emit('inhabilitar', item)"
              >
                <v-icon>mdi-delete-outline</v-icon>
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
</template>

<style scoped>
.table-card {
  background: linear-gradient(180deg, #0f1c2b 0%, #132238 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 8px 10px;
}

:deep(.materiales-table) {
  background: transparent;
  color: white;
}

:deep(.materiales-table .v-data-table-header__content) {
  font-weight: 800;
  color: #dfe7f4;
}

:deep(.materiales-table .v-table__wrapper > table > tbody > tr:hover) {
  background: rgba(255, 255, 255, 0.03);
}

:deep(.materiales-table .v-data-table-footer) {
  color: #dfe7f4;
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
</style>