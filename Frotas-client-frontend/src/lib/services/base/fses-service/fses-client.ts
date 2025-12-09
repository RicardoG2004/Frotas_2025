import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  FseDTO,
  CreateFseDTO,
  UpdateFseDTO,
} from '@/types/dtos/base/fses.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { FseError } from './fses-errors'

const BASE_ROUTE = '/client/base/fses'

export class FsesClient extends BaseApiClient {
  public async getFsesPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<FseDTO>>> {
    const cacheKey = this.getCacheKey('POST', `${BASE_ROUTE}/paginated`, params)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<FseDTO>
          >(state.URL, `${BASE_ROUTE}/paginated`, params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new FseError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new FseError(
            'Falha ao obter fses paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getFses(): Promise<ResponseApi<GSResponse<FseDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', BASE_ROUTE)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<GSResponse<FseDTO[]>>(
            state.URL,
            BASE_ROUTE
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new FseError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new FseError('Falha ao obter fses', undefined, error)
        }
      })
    )
  }

  public async getFse(id: string): Promise<ResponseApi<GSResponse<FseDTO>>> {
    const cacheKey = this.getCacheKey('GET', `${BASE_ROUTE}/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<GSResponse<FseDTO>>(
            state.URL,
            `${BASE_ROUTE}/${id}`
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new FseError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new FseError('Falha ao obter fse', undefined, error)
        }
      })
    )
  }

  public async createFse(
    data: CreateFseDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateFseDTO,
          GSResponse<string>
        >(state.URL, BASE_ROUTE, data)

        return response
      } catch (error) {
        if (error instanceof BaseApiError && error.data) {
          return {
            info: error.data as GSResponse<string>,
            status: error.statusCode || 400,
            statusText: error.message,
          }
        }
        throw error
      }
    })
  }

  public async updateFse(
    id: string,
    data: UpdateFseDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateFseDTO,
          GSResponse<string>
        >(state.URL, `${BASE_ROUTE}/${id}`, data)

        return response
      } catch (error) {
        if (error instanceof BaseApiError && error.data) {
          return {
            info: error.data as GSResponse<string>,
            status: error.statusCode || 400,
            statusText: error.message,
          }
        }
        throw error
      }
    })
  }

  public async deleteFse(id: string): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `${BASE_ROUTE}/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new FseError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new FseError('Falha ao apagar fse', undefined, error)
      }
    })
  }

  public async deleteMultipleFses(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, `${BASE_ROUTE}/bulk`, { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new FseError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new FseError('Falha ao apagar fses', undefined, error)
      }
    })
  }
}

