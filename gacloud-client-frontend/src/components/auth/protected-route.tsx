import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { usePermissionsStore } from '@/stores/permissions-store'
import { secureStorage } from '@/utils/secure-storage'
import { clearAllWindowData } from '@/utils/window-utils'

const TOKEN_CHECK_INTERVAL = 30000 // 30 seconds
let tokenCheckInProgress = false
let lastTokenCheck = 0

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { token, refreshToken, isAuthenticated, isLoaded, clearAuth } =
    useAuthStore()

  useEffect(() => {
    const validateAuth = async () => {
      // Check if there's stored auth data
      const storedAuth = secureStorage.get('auth-storage')
      if (!storedAuth || (!token && !refreshToken)) {
        console.log('No stored auth or tokens')
        clearAuth()
        navigate('/login')
        return
      }

      const currentTime = Date.now()

      // Prevent multiple simultaneous token checks
      if (
        tokenCheckInProgress ||
        currentTime - lastTokenCheck < TOKEN_CHECK_INTERVAL
      ) {
        return
      }

      try {
        tokenCheckInProgress = true

        // Verify token validity
        const isTokenValid = secureStorage.verify(token)
        const tokenExpiryTime = new Date(
          useAuthStore.getState().expiryTime
        ).getTime()

        if (!isTokenValid || tokenExpiryTime < currentTime) {
          // Try to refresh token
          const { authService } = await import(
            '@/lib/services/auth/auth.service'
          )
          const response = await authService.refreshToken()

          if (!response.succeeded) {
            console.log('Token refresh failed:', response.messages)
            // Clear all stores and redirect to login
            clearAllWindowData()
            clearAuth()
            usePermissionsStore.getState().setPermissions({})
            usePermissionsStore.getState().setModules([])
            navigate('/login')
            return
          }

          if ('data' in response && response.data) {
            const authStore = useAuthStore.getState()
            authStore.setToken(response.data.token)
            authStore.setRefreshToken(response.data.refreshToken)
            authStore.setExpiryTime(response.data.expiryTime)

            // Update user data
            useAuthStore.setState({
              name: `${response.data.user.firstName} ${response.data.user.lastName}`,
              email: response.data.user.email,
              userId: response.data.user.id,
              clientId: response.data.user.clienteId,
            })

            // Update permissions if available
            if (response.data.license) {
              useAuthStore.setState({
                permissions: response.data.license.permissions,
                modules: response.data.license.modules || [],
              })
              // Update permissions store
              usePermissionsStore
                .getState()
                .setPermissions(response.data.license.permissions)
              if (response.data.license.modules) {
                usePermissionsStore
                  .getState()
                  .setModules(response.data.license.modules)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error during auth validation:', error)
        // Clear all stores and redirect to login on error
        clearAllWindowData()
        clearAuth()
        usePermissionsStore.getState().setPermissions({})
        usePermissionsStore.getState().setModules([])
        navigate('/login')
      } finally {
        lastTokenCheck = currentTime
        tokenCheckInProgress = false
      }
    }

    // Run validation immediately and when auth is loaded
    if (!isAuthenticated) {
      validateAuth()
    }
  }, [token, refreshToken, isAuthenticated, isLoaded, clearAuth, navigate])

  // Show nothing while auth is loading
  if (!isLoaded) {
    return null
  }

  // If not authenticated after loading, return null (redirect will happen in useEffect)
  if (!isAuthenticated) {
    return null
  }

  return children
}
