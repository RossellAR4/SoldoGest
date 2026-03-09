<script setup>
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue','creado'])

const { authFetch } = useAuth()

const form = ref({
  nombre:'',
  email:'',
  password:'',
  rol:'empleado'
})

const loading = ref(false)

const cerrar = () => {
  emit('update:modelValue', false)
}

const crearUsuario = async () => {

  loading.value = true

  try {

    await authFetch('/usuarios', {
      method:'POST',
      body: form.value
    })

    emit('creado')
    cerrar()

    form.value = {
      nombre:'',
      email:'',
      password:'',
      rol:'empleado'
    }

  } catch (error) {
    console.error(error)
  }

  loading.value = false
}
</script>

<template>

<v-dialog
  :model-value="modelValue"
  max-width="500"
  @update:model-value="emit('update:modelValue',$event)"
>

<v-card class="dialog-card">

<v-card-title class="dialog-title">
Crear usuario
</v-card-title>

<v-card-text>

<v-text-field
  v-model="form.nombre"
  label="Nombre"
/>

<v-text-field
  v-model="form.email"
  label="Email"
/>

<v-text-field
  v-model="form.password"
  label="Password"
  type="password"
/>

<v-select
  v-model="form.rol"
  :items="['admin','empleado']"
  label="Rol"
/>

</v-card-text>

<v-card-actions>

<v-spacer/>

<v-btn
variant="text"
@click="cerrar"
>
Cancelar
</v-btn>

<v-btn
color="#ff7a00"
:loading="loading"
@click="crearUsuario"
>
Crear
</v-btn>

</v-card-actions>

</v-card>

</v-dialog>

</template>

<style scoped>

.dialog-card{
background:#0f1c2b;
color:white;
}

.dialog-title{
font-weight:700;
color:#ff7a00;
}

</style>