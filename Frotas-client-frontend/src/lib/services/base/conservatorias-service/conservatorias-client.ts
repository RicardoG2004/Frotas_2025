import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
} from '@/types/api/responses'
import { PaginatedResponse } from '@/types/api/responses'
import {
  CreateConservatoriaDTO,
  ConservatoriaDTO,
  UpdateConservatoriaDTO,
} from '@/types/dtos/base/conservatorias.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient } from '@/lib/base-client'
import { ConservatoriaError } from './conservatorias-errors'

export class ConservatoriasClient extends BaseApiClient {
  public async getConservatoriasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<ConservatoriaDTO>>> {
    const cacheKey = this.getCacheKey('POST', '/api/conservatorias/paginated', params)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<ConservatoriaDTO>
          >(state.URL, '/client/base/conservatorias/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ConservatoriaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          console.error('Falha ao obter conservatórias paginadas:', error)
          throw new ConservatoriaError(
            'Falha ao obter conservatórias paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getConservatorias(): Promise<ResponseApi<GSResponse<ConservatoriaDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/base/conservatorias')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ConservatoriaDTO[]>
          >(state.URL, '/client/base/conservatorias')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ConservatoriaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ConservatoriaError('Falha ao obter conservatórias', undefined, error)
        }
      })
    )
  }

  public async getConservatoria(id: string): Promise<ResponseApi<GSResponse<ConservatoriaDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/base/conservatorias/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ConservatoriaDTO>
          >(state.URL, `/client/base/conservatorias/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ConservatoriaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ConservatoriaError('Falha ao obter conservatória', undefined, error)
        }
      })
    )
  }

  public async createConservatoria(
    data: CreateConservatoriaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateConservatoriaDTO,
          GSResponse<string>
        >(state.URL, '/client/base/conservatorias', data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ConservatoriaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ConservatoriaError('Falha ao criar conservatória', undefined, error)
      }
    })
  }

  public async updateConservatoria(
    id: string,
    data: UpdateConservatoriaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateConservatoriaDTO,
          GSResponse<string>
        >(state.URL, `/client/base/conservatorias/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ConservatoriaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ConservatoriaError('Falha ao atualizar conservatória', undefined, error)
      }
    })
  }

  public async deleteConservatoria(id: string): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/base/conservatorias/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ConservatoriaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ConservatoriaError('Falha ao apagar conservatória', undefined, error)
      }
    })
  }

  public async deleteMultipleConservatorias(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/base/conservatorias/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ConservatoriaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ConservatoriaError(
          'Falha ao apagar múltiplas conservatórias',
          undefined,
          error
        )
      }
    })
  }
}

