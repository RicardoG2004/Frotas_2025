import axios, { type AxiosResponse, type AxiosError } from 'axios'
import { ResponseApi } from '@/types/responses'
import { useAuthStore } from '@/stores/auth-store'
import { usePermissionsStore } from '@/stores/permissions-store'
import { BaseApiError } from '@/lib/base-client'

export class HttpClient {
  private idFuncionalidade?: string
  private readonly apiKey: string = import.meta.env.VITE_API_KEY
  private tokenCheckInProgress = false
  private lastTokenCheck = 0
  private readonly TOKEN_CHECK_INTERVAL = 30000 // 30 seconds

  constructor(idFuncionalidade?: string) {
    this.idFuncionalidade = idFuncionalidade
  }

  private async renewToken(): Promise<boolean> {
    const currentTime = Date.now()

    if (
      this.tokenCheckInProgress ||
      currentTime - this.lastTokenCheck < this.TOKEN_CHECK_INTERVAL
    ) {
      return true
    }

    try {
      this.tokenCheckInProgress = true
      const { token, expiryTime } = useAuthStore.getState()

      if (!token) {
        return false
      }

      const tokenExpiryTime = new Date(expiryTime).getTime()

      if (tokenExpiryTime < currentTime) {
        const { authService } = await import('@/lib/services/auth/auth.service')
        const response = await authService.refreshToken()

        if (response.succeeded && 'data' in response && response.data) {
          const authStore = useAuthStore.getState()
          authStore.setToken(response.data.token)
          authStore.setRefreshToken(response.data.refreshToken)
          authStore.setExpiryTime(response.data.expiryTime)

          // Set user data directly from response
          useAuthStore.setState({
            name: `${response.data.user.firstName} ${response.data.user.lastName}`,
            email: response.data.user.email,
            userId: response.data.user.id,
            clientId: response.data.user.clienteId,
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

          console.log('🔑 Token successfully refreshed')
          return true
        }

        return false
      }

      return true
    } finally {
      this.lastTokenCheck = currentTime
      this.tokenCheckInProgress = false
    }
  }

  private async withTokenRenewal<T>(
    requestFn: () => Promise<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>> {
    const tokenValid = await this.renewToken()

    if (!tokenValid) {
      throw new Error('Unable to renew token')
    }

    return requestFn()
  }

  protected getHeaders(data?: unknown) {
    const { token } = useAuthStore.getState()

    const headers: Record<string, string> = {
      tenant: 'root',
      'Accept-Language': 'en-US',
      Authorization: `Bearer ${token}`,
      'X-API-Key': this.apiKey,
    }

    // Only set Content-Type for non-FormData requests
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    if (this.idFuncionalidade) {
      headers['X-Funcionalidade-Id'] = this.idFuncionalidade
    }

    return headers
  }

  public getRequest = async <T>(
    baseUrl: string,
    url: string
  ): Promise<ResponseApi<T>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.get(`${baseUrl}${url}`, {
          headers: this.getHeaders(),
        })
      )

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText,
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error)
      else throw handleError(error)
    }
  }

  public postRequest = async <T, U>(
    baseUrl: string,
    url: string,
    data: T
  ): Promise<ResponseApi<U>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.post(`${baseUrl}${url}`, data, {
          headers: this.getHeaders(data),
        })
      )

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText,
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error)
      else throw handleError(error)
    }
  }

  // Similarly update other methods (putRequest, deleteRequest, etc.)
  public putRequest = async <T, U>(
    baseUrl: string,
    url: string,
    data: T
  ): Promise<ResponseApi<U>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.put(`${baseUrl}${url}`, data, {
          headers: this.getHeaders(),
        })
      )

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText,
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error)
      else throw handleError(error)
    }
  }

  public deleteRequest = async <T>(
    baseUrl: string,
    url: string
  ): Promise<ResponseApi<T>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.delete(`${baseUrl}${url}`, {
          headers: this.getHeaders(),
        })
      )

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText,
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error)
      else throw handleError(error)
    }
  }

  public postWithoutDataRequest = async <T>(
    baseUrl: string,
    url: string
  ): Promise<ResponseApi<T>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.post(
          `${baseUrl}${url}`,
          {},
          {
            headers: this.getHeaders(),
          }
        )
      )

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText,
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error)
      else throw handleError(error)
    }
  }

  public putWithoutDataRequest = async <T>(
    baseUrl: string,
    url: string
  ): Promise<ResponseApi<T>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.put(
          `${baseUrl}${url}`,
          {},
          {
            headers: this.getHeaders(),
          }
        )
      )

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText,
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error)
      else throw handleError(error)
    }
  }

  public postRequestWithoutAuth = async <T, U>(
    baseUrl: string,
    url: string,
    data: T
  ): Promise<ResponseApi<U>> => {
    try {
      const response = await axios.post(`${baseUrl}${url}`, data, {
        headers: {
          tenant: 'root',
          'Accept-Language': 'en-US',
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
      })

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText,
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error)
      else throw handleError(error)
    }
  }

  public deleteRequestWithBody = async <TBody, TResponse>(
    baseUrl: string,
    url: string,
    body: TBody
  ): Promise<ResponseApi<TResponse>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.delete(`${baseUrl}${url}`, {
          headers: this.getHeaders(),
          data: body,
        })
      )

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText,
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error)
      else throw handleError(error)
    }
  }

  public patchRequest = async <T, U>(
    baseUrl: string,
    url: string,
    data: T
  ): Promise<ResponseApi<U>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.patch(`${baseUrl}${url}`, data, {
          headers: this.getHeaders(),
        })
      )

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText,
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error)
      else throw handleError(error)
    }
  }
}

// Factory function to create HttpClient instances
export const createHttpClient = (idFuncionalidade?: string) => {
  return new HttpClient(idFuncionalidade)
}

// Error handling function for Axios errors
function handleErrorAxios(error: AxiosError): never {
  if (axios.isAxiosError(error)) {
    if (
      error.response?.data &&
      typeof error.response.data === 'object' &&
      'status' in error.response.data &&
      'messages' in error.response.data
    ) {
      // For validation errors, preserve the structure
      throw new BaseApiError(
        'Validation Error',
        error.response.status,
        error.response.data
      )
    }

    throw new BaseApiError(error.message, error.response?.status)
  }

  throw new BaseApiError('Unknown error', 500)
}

// General error handling function
function handleError(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Unknown error'
  }

  return 'Unknown error'
}
