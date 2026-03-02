<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '../api/http'

import fondoLogin from '../assets/img/fondo_login.jpeg'
import panelMetal from '../assets/img/fondo_login2.png'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const res = await http.post('/usuarios/login', {
      email: email.value,
      password: password.value
    })

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario))

    router.push('/home')
  } catch (err) {
    error.value = 'Credenciales incorrectas'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">

    <!-- Imagen de fondo -->
    <img class="bg-image" :src="fondoLogin" alt="Soldadores trabajando" />

    <!-- Oscurecedor -->
    <div class="overlay"></div>

    <!-- Panel metálico -->
    <div class="login-panel" :style="{ backgroundImage: `url(${panelMetal})` }">
      <h1>SOLDOGEST</h1>
      <p>SISTEMA DE CONTROL · INICIAR SESIÓN</p>

      <input v-model="email" type="email" placeholder="Correo electrónico" />
      <input v-model="password" type="password" placeholder="Contraseña" />

      <button @click="handleLogin" :disabled="loading">
        {{ loading ? 'Ingresando...' : 'INICIAR SESIÓN' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>

/* Contenedor principal */
.login-container{
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Imagen fondo estilo web completo */
.bg-image{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;          /* llena toda la pantalla */
  object-position: center;    /* puedes cambiar a right center si corta */
  transform: scale(1.08);     /* pequeño zoom para cubrir mejor */
}

/* Capa oscura */
.overlay{
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.65);
}

/* Panel metálico */
.login-panel{
  position: relative;
  z-index: 1;
  width: 480px;
  padding: 50px;
  border-radius: 18px;
  background-size: cover;
  background-position: center;
  text-align: center;
  color: white;

  /* Estética industrial */
  border: 2px solid #ff6a00;
  box-shadow: 0 0 25px rgba(255,106,0,0.4),
              0 35px 80px rgba(0,0,0,0.8);
}

/* Título */
.login-panel h1{
  margin-bottom: 12px;
  letter-spacing: 3px;
  font-weight: 900;
}

/* Subtítulo */
.login-panel p{
  margin-bottom: 30px;
  font-size: 12px;
  opacity: 0.85;
}

/* Inputs */
.login-panel input{
  width: 100%;
  padding: 14px;
  margin-bottom: 16px;
  border-radius: 10px;
  border: none;
  outline: none;
  font-size: 14px;
}

/* Botón naranja */
.login-panel button{
  width: 100%;
  padding: 14px;
  background: #ff6a00;
  color: white;
  font-weight: 800;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.login-panel button:hover{
  background: #ff7f1a;
  box-shadow: 0 0 15px rgba(255,106,0,0.6);
}

.login-panel button:disabled{
  opacity: 0.7;
  cursor: not-allowed;
}

/* Error */
.error{
  margin-top: 12px;
  color: #ff4d4d;
  font-weight: 600;
}

</style>