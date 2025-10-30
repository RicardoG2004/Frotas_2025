import state from '@/states/state'
import { LoginResponse } from '@/types/api/responses'
import { useAuthStore } from '@/stores/auth-store'
import { usePermissionsStore } from '@/stores/permissions-store'
import { createHttpClient } from '@/lib/http-client'
import { clearAllWindowData } from '@/utils/window-utils'

interface LoginCredentials {
  email: string
  password: string
}

const httpClient = createHttpClient()

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await httpClient.postRequestWithoutAuth<
      LoginCredentials,
      LoginResponse
    >(state.URL_ACCESS_CONTROL, '/api/client-token', credentials)

    return response.info
  },

  async refreshToken() {
    const { refreshToken } = useAuthStore.getState()
    if (!refreshToken) {
      console.log('Token Refresh: No refresh token available')
      clearAllWindowData()
      return {
        succeeded: false,
        messages: { error: 'No refresh token available' },
      }
    }

    console.log('Token Refresh: Attempting to refresh token...')
    try {
      const response = await httpClient.getRequest<LoginResponse>(
        state.URL_ACCESS_CONTROL,
        `/api/client-token/refresh/${refreshToken}`
      )

      if (response.info.succeeded && response.info.data) {
        console.log('Token Refresh: Successfully refreshed token')
        console.log(
          'Token Refresh: New permissions:',
          response.info.data.license?.permissions
        )
        console.log(
          'Token Refresh: New modules:',
          response.info.data.license?.modules
        )

        // Update auth store with all user data
        const newState = {
          token: response.info.data.token,
          refreshToken: response.info.data.refreshToken,
          expiryTime: response.info.data.expiryTime,
          name: `${response.info.data.user.firstName} ${response.info.data.user.lastName}`,
          email: response.info.data.user.email,
          userId: response.info.data.user.id,
          clientId: response.info.data.user.clienteId,
          permissions: response.info.data.license?.permissions || {},
          modules: response.info.data.license?.modules || [],
        }

        // Update auth store
        useAuthStore.setState(newState)

        // Clear and set new permissions and modules
        if (response.info.data.license) {
          console.log('Token Refresh: Updating permissions store')

          // Check if permissions or modules have actually changed
          const permissionsChanged = usePermissionsStore
            .getState()
            .havePermissionsChanged(response.info.data.license.permissions)
          const modulesChanged = usePermissionsStore
            .getState()
            .haveModulesChanged(response.info.data.license.modules || [])

          if (permissionsChanged || modulesChanged) {
            console.log(
              'Token Refresh: Permissions or modules changed, updating stores'
            )
            // Set new permissions and modules directly
            usePermissionsStore
              .getState()
              .setPermissions(response.info.data.license.permissions)
            usePermissionsStore
              .getState()
              .setModules(response.info.data.license.modules || [])
          } else {
            console.log('Token Refresh: No changes in permissions or modules')
          }
        }

        return response.info
      } else {
        console.log(
          'Token Refresh: Failed to refresh token',
          response.info.messages
        )
        // Clear auth state and window data on failed refresh
        clearAllWindowData()
        useAuthStore.getState().clearAuth()
        return {
          succeeded: false,
          messages: response.info.messages,
        }
      }
    } catch (error) {
      console.error('Token Refresh: Error during refresh:', error)
      // Clear auth state and window data on error
      clearAllWindowData()
      useAuthStore.getState().clearAuth()
      return {
        succeeded: false,
        messages: { error: 'Failed to refresh token' },
      }
    }
  },
}
