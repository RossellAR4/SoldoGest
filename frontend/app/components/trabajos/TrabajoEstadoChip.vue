<script setup>
import { computed } from 'vue'

const props = defineProps({
  estado: {
    type: String,
    required: true
  }
})

const label = computed(() => {
  if (props.estado === 'finalizado') return 'Finalizado'
  if (props.estado === 'cancelado') return 'Cancelado'
  return 'En proceso'
})

const chipClass = computed(() => {
  if (props.estado === 'finalizado') return 'chip-finalizado'
  if (props.estado === 'cancelado') return 'chip-cancelado'
  return 'chip-proceso'
})
</script>

<template>
  <span class="estado-chip" :class="chipClass">
    {{ label }}
  </span>
</template>

<style scoped>
.estado-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  white-space: nowrap;
}

.chip-proceso {
  background: rgba(255, 166, 0, 0.18);
  color: #ffbe5c;
  border: 1px solid rgba(255, 190, 92, 0.35);
}

.chip-finalizado {
  background: rgba(76, 175, 80, 0.18);
  color: #9be29d;
  border: 1px solid rgba(155, 226, 157, 0.35);
}

.chip-cancelado {
  background: rgba(255, 99, 71, 0.16);
  color: #ff9a86;
  border: 1px solid rgba(255, 154, 134, 0.35);
}
</style>