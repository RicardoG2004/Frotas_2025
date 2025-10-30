import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
} from '@/types/api/responses'
import { PaginatedResponse } from '@/types/api/responses'
import {
  CreatePaisDTO,
  PaisDTO,
  UpdatePaisDTO,
} from '@/types/dtos/base/paises.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient } from '@/lib/base-client'
import { PaisError } from './paises-errors'

export class PaisesClient extends BaseApiClient {
  public async getPaisesPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<PaisDTO>>> {
    const cacheKey = this.getCacheKey('POST', '/api/paises/paginated', params)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<PaisDTO>
          >(state.URL, '/client/base/paises/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PaisError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          console.error('Falha ao obter países paginados:', error)
          throw new PaisError(
            'Falha ao obter países paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getPaises(): Promise<ResponseApi<GSResponse<PaisDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/base/paises')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<PaisDTO[]>
          >(state.URL, '/client/base/paises')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PaisError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new PaisError('Falha ao obter países', undefined, error)
        }
      })
    )
  }

  public async getPais(id: string): Promise<ResponseApi<GSResponse<PaisDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/base/paises/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<PaisDTO>
          >(state.URL, `/client/base/paises/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PaisError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new PaisError('Falha ao obter país', undefined, error)
        }
      })
    )
  }

  public async createPais(
    data: CreatePaisDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreatePaisDTO,
          GSResponse<string>
        >(state.URL, '/client/base/paises', data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PaisError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PaisError('Falha ao criar país', undefined, error)
      }
    })
  }

  public async updatePais(
    id: string,
    data: UpdatePaisDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdatePaisDTO,
          GSResponse<string>
        >(state.URL, `/client/base/paises/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PaisError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PaisError('Falha ao atualizar país', undefined, error)
      }
    })
  }

  public async deletePais(id: string): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/base/paises/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PaisError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PaisError('Falha ao apagar país', undefined, error)
      }
    })
  }

  public async deleteMultiplePaises(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/base/paises/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PaisError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PaisError(
          'Falha ao apagar múltiplos países',
          undefined,
          error
        )
      }
    })
  }
}
