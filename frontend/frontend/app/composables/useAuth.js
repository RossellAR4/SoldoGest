export const useAuth = () => {
  const token = useCookie('token', {
    default: () => null,
    sameSite: 'lax',
    secure: false
  })

  const usuario = useCookie('usuario', {
    default: () => null,
    sameSite: 'lax',
    secure: false
  })

  const authUser = useState('authUser', () => null)

  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const login = async (credentials) => {
    const response = await $fetch(`${apiBase}/usuarios/login`, {
      method: 'POST',
      body: credentials
    })

    token.value = response.token
    usuario.value = JSON.stringify(response.usuario)
    authUser.value = response.usuario

    return response
  }

  const logout = async () => {
    token.value = null
    usuario.value = null
    authUser.value = null
    await navigateTo('/login')
  }

  const getUser = () => {
    if (authUser.value) return authUser.value

    try {
      if (!usuario.value) return null
      const parsed = JSON.parse(usuario.value)
      authUser.value = parsed
      return parsed
    } catch (error) {
      return null
    }
  }

  const isAuthenticated = () => {
    return !!token.value
  }

  const authFetch = async (url, options = {}) => {
    if (!token.value) {
      throw new Error('No hay token disponible')
    }

    return await $fetch(`${apiBase}${url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token.value}`
      }
    })
  }

  return {
    token,
    usuario,
    authUser,
    login,
    logout,
    getUser,
    isAuthenticated,
    authFetch
  }
}