import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
} from '@/types/api/responses'
import { PaginatedResponse } from '@/types/api/responses'
import {
  CreateDelegacaoDTO,
  DelegacaoDTO,
  UpdateDelegacaoDTO,
} from '@/types/dtos/base/delegacoes.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient } from '@/lib/base-client'
import { DelegacaoError } from './delegacoes-errors'

export class DelegacoesClient extends BaseApiClient {
  public async getDelegacoesPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<DelegacaoDTO>>> {
    const cacheKey = this.getCacheKey('POST', '/api/delegacoes/paginated', params)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<DelegacaoDTO>
          >(state.URL, '/client/base/delegacoes/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new DelegacaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          console.error('Falha ao obter delegações paginadas:', error)
          throw new DelegacaoError(
            'Falha ao obter delegações paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getDelegacoes(): Promise<ResponseApi<GSResponse<DelegacaoDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/base/delegacoes')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<DelegacaoDTO[]>
          >(state.URL, '/client/base/delegacoes')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new DelegacaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new DelegacaoError('Falha ao obter delegações', undefined, error)
        }
      })
    )
  }

  public async getDelegacao(id: string): Promise<ResponseApi<GSResponse<DelegacaoDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/base/delegacoes/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<DelegacaoDTO>
          >(state.URL, `/client/base/delegacoes/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new DelegacaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new DelegacaoError('Falha ao obter delegação', undefined, error)
        }
      })
    )
  }

  public async createDelegacao(
    data: CreateDelegacaoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateDelegacaoDTO,
          GSResponse<string>
        >(state.URL, '/client/base/delegacoes', data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new DelegacaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new DelegacaoError('Falha ao criar delegação', undefined, error)
      }
    })
  }

  public async updateDelegacao(
    id: string,
    data: UpdateDelegacaoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateDelegacaoDTO,
          GSResponse<string>
        >(state.URL, `/client/base/delegacoes/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new DelegacaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new DelegacaoError('Falha ao atualizar delegação', undefined, error)
      }
    })
  }

  public async deleteDelegacao(id: string): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/base/delegacoes/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new DelegacaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new DelegacaoError('Falha ao apagar delegação', undefined, error)
      }
    })
  }

  public async deleteMultipleDelegacoes(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/base/delegacoes/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new DelegacaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new DelegacaoError(
          'Falha ao apagar múltiplas delegações',
          undefined,
          error
        )
      }
    })
  }
}

