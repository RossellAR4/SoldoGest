export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('token')

  if (token.value && token.value !== 'null' && token.value !== 'undefined') {
    return navigateTo('/', { replace: true })
  }
})