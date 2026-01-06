import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { secureStorage } from '@/utils/secure-storage'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
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

      // Verify token validity
      const isTokenValid = secureStorage.verify(token)

      if (!isTokenValid) {
        // Try to refresh token
        const TokensClient = (await import('@/lib/services/auth/tokens-client'))
          .default
        const success = await TokensClient.getRefresh()

        if (!success) {
          console.log('Token refresh failed')
          clearAuth()
          navigate('/login')
        }
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
