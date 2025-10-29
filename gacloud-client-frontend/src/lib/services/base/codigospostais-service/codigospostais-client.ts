import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CodigoPostalDTO,
  CreateCodigoPostalDTO,
  UpdateCodigoPostalDTO,
} from '@/types/dtos/base/codigospostais.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { CodigoPostalError } from './codigospostais-errors'

export class CodigosPostaisClient extends BaseApiClient {
  public async getCodigosPostaisPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<CodigoPostalDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/base/codigospostais/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<CodigoPostalDTO>
          >(state.URL, '/client/base/codigospostais/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CodigoPostalError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CodigoPostalError(
            'Falha ao obter códigos postais paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getCodigosPostais(): Promise<
    ResponseApi<GSResponse<CodigoPostalDTO[]>>
  > {
    const cacheKey = this.getCacheKey('GET', '/client/base/codigospostais')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<CodigoPostalDTO[]>
          >(state.URL, '/client/base/codigospostais')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CodigoPostalError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CodigoPostalError(
            'Falha ao obter códigos postais',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createCodigoPostal(
    data: CreateCodigoPostalDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateCodigoPostalDTO,
          GSResponse<string>
        >(state.URL, '/client/base/codigospostais', data)

        return response
      } catch (error) {
        if (error instanceof BaseApiError && error.data) {
          // If it's a validation error, return it as a response
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

  public async updateCodigoPostal(
    id: string,
    data: UpdateCodigoPostalDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateCodigoPostalDTO,
          GSResponse<string>
        >(state.URL, `/client/base/codigospostais/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CodigoPostalError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CodigoPostalError(
          'Falha ao atualizar código postal',
          undefined,
          error
        )
      }
    })
  }

  public async deleteCodigoPostal(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/base/codigospostais/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CodigoPostalError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CodigoPostalError(
          'Falha ao apagar código postal',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleCodigosPostais(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/base/codigospostais/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CodigoPostalError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CodigoPostalError(
          'Falha ao apagar múltiplos códigos postais',
          undefined,
          error
        )
      }
    })
  }

  public async getCodigoPostal(
    id: string
  ): Promise<ResponseApi<GSResponse<CodigoPostalDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/base/codigospostais/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<CodigoPostalDTO>
          >(state.URL, `/client/base/codigospostais/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CodigoPostalError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CodigoPostalError(
            'Falha ao obter código postal',
            undefined,
            error
          )
        }
      })
    )
  }
}
