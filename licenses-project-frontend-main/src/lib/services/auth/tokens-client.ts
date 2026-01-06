import axios, { type AxiosRequestConfig } from 'axios'
import state from '@/states/state'
import { UpdateInfo } from '@/types/dtos'
import type { ResponseLogin, BackendUpdateInfo } from '@/types/responses'
import { useAuthStore } from '@/stores/auth-store'
import type { AuthState } from '@/stores/auth-store'

class TokensClient {
  constructor() {
    // ... existing code ...
  }

  private mapBackendUpdateInfoToUpdateInfo(
    backendUpdate: BackendUpdateInfo | undefined
  ): UpdateInfo | null {
    if (!backendUpdate || !backendUpdate.hasUpdate) {
      return null
    }

    return {
      updateAvailable: backendUpdate.hasUpdate,
      latestVersion: backendUpdate.updateVersion,
      isMandatory: backendUpdate.isMandatory,
      releaseNotes: backendUpdate.releaseNotes,
      updateId: backendUpdate.updateId,
    }
  }

  public login = async (email: string, password: string): Promise<boolean> => {
    const { decodeToken, setUpdateInfo } = useAuthStore.getState()

    const options: AxiosRequestConfig = {
      method: 'POST',
      url: `${state.URL}/api/tokens`,
      headers: {
        tenant: 'root',
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'X-API-Key': state.ApiKey,
      },
      data: { email, password },
    }

    try {
      const response = await axios.request(options)

      if (response.status === 200 && response.data.data != null) {
        const loginResponse: ResponseLogin = response.data.data

        // Map backend update info to frontend format
        const updateInfo = this.mapBackendUpdateInfoToUpdateInfo(
          loginResponse.update
        )
        setUpdateInfo(updateInfo)

        // Create a state object with only the defined properties
        const newState: Partial<AuthState> = {
          token: loginResponse.token,
          refreshToken: loginResponse.refreshToken,
          refreshTokenExpiryTime: loginResponse.refreshTokenExpiryTime,
          email: email,
          clienteId: loginResponse.data.clienteId,
          licencaId: loginResponse.data.licencaId,
          isAuthenticated: true,
          isLoaded: true,
        }

        // Use type-safe setState
        useAuthStore.setState((state) => ({
          ...state,
          ...newState,
        }))

        // Decode token to get additional user info
        await decodeToken()

        return true
      }
      return false
    } catch (err) {
      console.error('Login error:', err)
      return false
    }
  }

  public getRefresh = async (): Promise<boolean> => {
    const { setToken, setRefreshToken, clearAuth, setUpdateInfo } =
      useAuthStore.getState()
    const refreshToken = useAuthStore.getState().refreshToken

    if (!refreshToken) {
      console.error('No refresh token available')
      clearAuth()
      return false
    }

    const options: AxiosRequestConfig = {
      method: 'GET',
      url: `${state.URL}/api/tokens/${refreshToken}`,
      headers: {
        tenant: 'root',
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'X-API-Key': state.ApiKey,
      },
    }

    try {
      const response = await axios.request(options)

      console.log('getRefresh response', response)

      if (
        response.status === 200 &&
        response.data?.data &&
        response.data.data.token &&
        response.data.data.refreshToken
      ) {
        const refreshResponse: ResponseLogin = response.data.data
        setToken(refreshResponse.token)
        setRefreshToken(refreshResponse.refreshToken)

        // Update update info if present
        const updateInfo = this.mapBackendUpdateInfoToUpdateInfo(
          refreshResponse.update
        )
        setUpdateInfo(updateInfo)

        return true
      }

      // If we get here, the response was not valid
      console.error('Invalid refresh response:', response.data)
      clearAuth()
      return false
    } catch (err) {
      console.error('Refresh error', err)
      clearAuth()
      return false
    }
  }
}

// Export a singleton instance
export default new TokensClient()
