<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const { login } = useAuth()

const submitLogin = async () => {
  errorMsg.value = ''

  if (!email.value || !password.value) {
    errorMsg.value = 'Ingrese su email y contraseña'
    return
  }

  loading.value = true

  try {
    await login({
      email: email.value,
      password: password.value
    })

    await navigateTo('/')
  } catch (error) {
    if (error?.data?.errors?.length) {
      errorMsg.value = error.data.errors[0].msg
    } else {
      errorMsg.value =
        error?.data?.message ||
        error?.data?.error ||
        'Credenciales inválidas'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container fluid class="login-page pa-0">
    <div class="login-background">
      <div class="overlay-dark"></div>

      <div class="login-center">
        <div class="iron-box">
          <v-card class="login-card" elevation="0">
            <div class="brand-title">SOLDOGEST</div>

            <div class="brand-subtitle">
              SISTEMA DE CONTROL - INICIAR SESIÓN
            </div>

            <v-alert
              v-if="errorMsg"
              type="error"
              variant="tonal"
              density="comfortable"
              class="mb-4"
            >
              {{ errorMsg }}
            </v-alert>

            <v-form @submit.prevent="submitLogin">
              <v-text-field
                v-model="email"
                label="Correo electrónico"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                class="mb-3 custom-field"
                hide-details="auto"
                autocomplete="username"
              />

              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                class="mb-4 custom-field"
                hide-details="auto"
                autocomplete="current-password"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-btn
                type="submit"
                block
                size="large"
                class="login-btn"
                :loading="loading"
              >
                INICIAR SESIÓN
              </v-btn>
            </v-form>
          </v-card>
        </div>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.login-background {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('../assets/img/fondo_login.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.overlay-dark {
  position: absolute;
  inset: 0;
  background: rgba(8, 14, 22, 0.35);
}

.login-center {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.iron-box {
  width: 100%;
  max-width: 700px;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 70px 40px;
  background-image: url('../assets/img/fondo_login2.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.login-card {
  width: 100%;
  max-width: 360px;
  padding: 32px 28px;
  border-radius: 16px;
  background: linear-gradient(180deg, #0f1c2b 0%, #1a2433 100%);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  color: white;
}

.brand-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: 1px;
  color: #ffffff;
  margin-bottom: 18px;
}

.brand-subtitle {
  text-align: center;
  font-size: 1rem;
  color: #d6dbe3;
  margin-bottom: 24px;
}

:deep(.custom-field .v-field) {
  background: rgba(9, 18, 29, 0.88);
  border-radius: 10px;
}

:deep(.custom-field .v-field__outline) {
  color: rgba(255, 122, 0, 0.65);
}

:deep(.custom-field input) {
  color: white;
}

:deep(.custom-field .v-label) {
  color: #d9e1ea;
}

:deep(.custom-field .v-icon) {
  color: #d9e1ea;
}

.login-btn {
  background: #ff6a00 !important;
  color: white !important;
  font-weight: 800;
  letter-spacing: 0.5px;
  border-radius: 10px;
}

@media (max-width: 768px) {
  .iron-box {
    min-height: auto;
    padding: 30px 20px;
    background-size: cover;
  }

  .login-card {
    max-width: 100%;
    padding: 24px 18px;
  }

  .brand-title {
    font-size: 1.8rem;
  }

  .brand-subtitle {
    font-size: 0.9rem;
  }
}
</style>