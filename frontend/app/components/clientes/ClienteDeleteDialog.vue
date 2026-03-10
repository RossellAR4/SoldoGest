<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  cliente: {
    type: Object,
    default: null
  },
  deleting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirmar'])

const closeDialog = () => {
  emit('update:modelValue', false)
}

const confirmDelete = () => {
  emit('confirmar')
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="dialog-card confirm-card">
      <v-card-title class="dialog-title">
        Inhabilitar cliente
      </v-card-title>

      <v-card-text class="confirm-text">
        ¿Deseas inhabilitar a
        <strong>{{ cliente?.nombre }}</strong>?
        Esta acción ocultará el cliente de los listados activos.
      </v-card-text>

      <v-card-actions class="dialog-actions">
        <v-btn variant="text" @click="closeDialog">
          Cancelar
        </v-btn>

        <v-btn
          color="deep-orange"
          variant="flat"
          :loading="deleting"
          @click="confirmDelete"
        >
          Inhabilitar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dialog-card {
  background: linear-gradient(180deg, #0f1c2b 0%, #132238 100%);
  border-radius: 18px;
}

.confirm-card {
  border: 1px solid rgba(255, 106, 0, 0.25);
}

.dialog-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
  padding-top: 22px;
}

.confirm-text {
  color: #dbe4f2;
  line-height: 1.6;
}

.dialog-actions {
  padding: 16px 24px 22px;
  justify-content: flex-end;
}
</style>