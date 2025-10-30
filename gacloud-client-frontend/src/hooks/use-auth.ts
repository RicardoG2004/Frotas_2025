import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { usePermissionsStore } from '@/stores/permissions-store'
import { initializeAppData } from '@/lib/config/app-initialization'
import { authService } from '@/lib/services/auth/auth.service'
import { toast } from '@/utils/toast-utils'
import { useEpocaPredefined } from '@/hooks/use-epoca-predefined'
import { useEpocaSelection } from '@/hooks/use-epoca-selection'

export function useLogin() {
  const navigate = useNavigate()
  const { setToken, setRefreshToken, setExpiryTime } = useAuthStore()
  const { updatePredefinedEpoca } = useEpocaPredefined()
  const { getSelectedEpoca } = useEpocaSelection()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (response) => {
      if (response.succeeded && response.data) {
        setToken(response.data.token)
        setRefreshToken(response.data.refreshToken)
        setExpiryTime(response.data.expiryTime)

        // Set user data directly from response
        useAuthStore.setState({
          name: `${response.data.user.firstName} ${response.data.user.lastName}`,
          email: response.data.user.email,
        })

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

        // Initialize app data using the new centralized configuration
        await initializeAppData.initialize(
          getSelectedEpoca,
          updatePredefinedEpoca
        )

        navigate('/')
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
      toast.error('Falha no login')
    },
  })
}
