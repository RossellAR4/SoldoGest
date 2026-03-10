export const useAuth = () => {
  const token = useCookie('token', {
    default: () => null,
    sameSite: 'lax',
    secure: false,
    path: '/'
  })

  const usuario = useCookie('usuario', {
    default: () => null,
    sameSite: 'lax',
    secure: false,
    path: '/'
  })

  const authUser = useState('authUser', () => null)

  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const clearSession = () => {
    token.value = null
    usuario.value = null
    authUser.value = null
  }

  const login = async (credentials) => {
    const response = await $fetch(`${apiBase}/usuarios/login`, {
      method: 'POST',
      body: credentials
    })

    token.value = response.token
    usuario.value = response.usuario
    authUser.value = response.usuario

    return response
  }

  const logout = async () => {
    clearSession()
    await navigateTo('/login', { replace: true })
  }

  const getUser = () => {
    if (authUser.value) return authUser.value

    if (!usuario.value || usuario.value === 'null' || usuario.value === 'undefined') {
      return null
    }

    try {
      const parsed =
        typeof usuario.value === 'string'
          ? JSON.parse(usuario.value)
          : usuario.value

      authUser.value = parsed
      return parsed
    } catch (error) {
      clearSession()
      return null
    }
  }

  const isAuthenticated = () => {
    return !!token.value && token.value !== 'null' && token.value !== 'undefined'
  }

  const authFetch = async (url, options = {}) => {
    if (!isAuthenticated()) {
      clearSession()
      await navigateTo('/login', { replace: true })
      throw new Error('No hay token disponible')
    }

    try {
      return await $fetch(`${apiBase}${url}`, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token.value}`
        }
      })
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        clearSession()
        await navigateTo('/login', { replace: true })
      }

      throw error
    }
  }

  return {
    token,
    usuario,
    authUser,
    login,
    logout,
    clearSession,
    getUser,
    isAuthenticated,
    authFetch
  }
}