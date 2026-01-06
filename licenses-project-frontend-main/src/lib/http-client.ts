import axios, { type AxiosResponse, type AxiosError } from 'axios'
import state from '@/states/state'
import { GSResponseToken } from '@/types/api/responses'
import { ResponseApi } from '@/types/responses'
import { jwtDecode } from 'jwt-decode'
import { useAuthStore } from '@/stores/auth-store'
import { BaseApiError } from '@/lib/base-client'
import { useNavigationStore } from '@/utils/navigation'
import { secureStorage } from '@/utils/secure-storage'

export class HttpClient {
  private idFuncionalidade?: string

  // Get API URL dynamically based on current protocol
  private get apiUrl(): string {
    return state.URL
  }

  // Get API key from state
  private get apiKey(): string {
    return state.ApiKey
  }

  constructor(idFuncionalidade?: string) {
    this.idFuncionalidade = idFuncionalidade
  }

  private async validateAndRenewToken(): Promise<boolean> {
    try {
      const { token, refreshToken, clearAuth } = useAuthStore.getState()
      const navigate = useNavigationStore.getState().navigate

      // First validate the stored auth data
      const storedAuth = secureStorage.get('auth-storage')
      if (!storedAuth || (!token && !refreshToken)) {
        console.log('No stored auth or tokens')
        clearAuth()
        navigate('/login')
        return false
      }

      // If we have a token, check if it's valid
      if (token) {
        try {
          const decodedToken: GSResponseToken = jwtDecode(token)
          const tokenExpiryTime = decodedToken.exp * 1000
          const currentTime = Date.now()

          // If token is still valid, return true
          if (tokenExpiryTime > currentTime) {
            return true
          }
        } catch (error) {
          console.error('Token decode error:', error)
        }
      }

      // If we get here, either token is invalid or we don't have one
      // Try to refresh if we have a refresh token
      if (refreshToken) {
        console.log('Attempting to refresh token')
        const TokensClient = (await import('@/lib/services/auth/tokens-client'))
          .default
        const success = await TokensClient.getRefresh()

        if (success) {
          console.log('Token refreshed successfully')
          return true
        }
      }

      // If we get here, refresh failed or we had no refresh token
      console.log('Token validation/refresh failed')
      clearAuth()
      navigate('/login')
      return false
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }

  private async withTokenRenewal<T>(
    requestFn: () => Promise<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>> {
    const tokenValid = await this.validateAndRenewToken()

    if (!tokenValid) {
      throw new Error('Unable to renew token')
    }

    return requestFn()
  }

  protected getHeaders() {
    const { token } = useAuthStore.getState()

    const headers: Record<string, string> = {
      tenant: 'root',
      'Accept-Language': 'en-US',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-API-Key': this.apiKey,
    }

    if (this.idFuncionalidade) {
      headers['X-Funcionalidade-Id'] = this.idFuncionalidade
    }

    return headers
  }

  public getRequest = async <T>(url: string): Promise<ResponseApi<T>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.get(`${this.apiUrl}${url}`, {
          headers: this.getHeaders(),
        })
      )

      return {
        info: response.data,
        status: response.status,
        statusText: response.statusText,
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log('AxiosError')
        console.log(error)
        throw handleErrorAxios(error)
      } else {
        console.log('Not an AxiosError')
        console.log(error)
        throw handleError(error)
      }
    }
  }

  public postRequest = async <T, U>(
    url: string,
    data: T
  ): Promise<ResponseApi<U>> => {
    try {
      //

      const response = await this.withTokenRenewal(() =>
        axios.post(`${this.apiUrl}${url}`, data, {
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

  // Similarly update other methods (putRequest, deleteRequest, etc.)
  public putRequest = async <T, U>(
    url: string,
    data: T
  ): Promise<ResponseApi<U>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.put(`${this.apiUrl}${url}`, data, {
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

  public deleteRequest = async <T>(url: string): Promise<ResponseApi<T>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.delete(`${this.apiUrl}${url}`, {
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
    url: string
  ): Promise<ResponseApi<T>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.post(
          `${this.apiUrl}${url}`,
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
    url: string
  ): Promise<ResponseApi<T>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.put(
          `${this.apiUrl}${url}`,
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

  public getRequestWithoutAuth = async <T>(
    url: string
  ): Promise<ResponseApi<T>> => {
    const fullUrl = `${this.apiUrl}${url}`
    const headers = {
      tenant: 'root',
      'Accept-Language': 'en-US',
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
    }

    try {
      const response = await axios.get(fullUrl, { headers })

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
    url: string,
    data: T
  ): Promise<ResponseApi<U>> => {
    try {
      const response = await axios.post(`${this.apiUrl}${url}`, data, {
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
    url: string,
    body: TBody
  ): Promise<ResponseApi<TResponse>> => {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.delete(`${this.apiUrl}${url}`, {
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

  public async uploadFileRequest<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ResponseApi<T>> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const headers = this.getHeaders()
      // Remove Content-Type header to let browser set it with boundary for multipart/form-data
      delete headers['Content-Type']

      const response = await this.withTokenRenewal(() =>
        axios.post(`${this.apiUrl}${url}`, formData, {
          headers,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              )
              onProgress(percentCompleted)
            }
          },
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

  public async downloadFileRequest(
    url: string,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.get(`${this.apiUrl}${url}`, {
          headers: this.getHeaders(),
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              )
              onProgress(percentCompleted)
            }
          },
        })
      )

      return response.data as Blob
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error)
      else throw handleError(error)
    }
  }

  public async downloadFilePostRequest<T>(
    url: string,
    data: T,
    onProgress?: (progress: number) => void
  ): Promise<{ blob: Blob; filename: string }> {
    try {
      const response = await this.withTokenRenewal(() =>
        axios.post(`${this.apiUrl}${url}`, data, {
          headers: this.getHeaders(),
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              )
              onProgress(percentCompleted)
            }
          },
        })
      )

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition']
      let filename = 'updater-config.json'
      if (contentDisposition) {
        // Try to match filename="..." or filename=...
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        )
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '')
        } else {
          // Fallback: try to match filename*=UTF-8''...
          const filenameStarMatch = contentDisposition.match(
            /filename\*=UTF-8''(.+)/
          )
          if (filenameStarMatch && filenameStarMatch[1]) {
            filename = decodeURIComponent(filenameStarMatch[1])
          }
        }
      }

      return {
        blob: response.data as Blob,
        filename,
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw handleErrorAxios(error)
      else throw handleError(error)
    }
  }
}

export const createHttpClient = (idFuncionalidade: string) =>
  new HttpClient(idFuncionalidade)

// Error handling function for Axios errors
function handleErrorAxios(error: AxiosError): never {
  if (axios.isAxiosError(error)) {
    if (
      error.response?.data &&
      typeof error.response.data === 'object' &&
      'succeeded' in error.response.data &&
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
