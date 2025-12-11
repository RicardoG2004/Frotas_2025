import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  ManutencaoDTO,
  CreateManutencaoDTO,
  UpdateManutencaoDTO,
} from '@/types/dtos/frotas/manutencoes.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { ManutencaoError } from './manutencoes-errors'

export class ManutencaoClient extends BaseApiClient {
  public async getManutencoesPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<ManutencaoDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/manutencoes/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<ManutencaoDTO>
          >(
            state.URL,
            '/client/frotas/manutencoes/paginated',
            params
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ManutencaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ManutencaoError(
            'Falha ao obter manutenções paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getManutencoes(): Promise<
    ResponseApi<GSResponse<ManutencaoDTO[]>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/client/frotas/manutencoes'
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ManutencaoDTO[]>
          >(state.URL, '/client/frotas/manutencoes')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ManutencaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ManutencaoError(
            'Falha ao obter manutenções',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getManutencao(
    id: string
  ): Promise<ResponseApi<GSResponse<ManutencaoDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/manutencoes/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ManutencaoDTO>
          >(state.URL, `/client/frotas/manutencoes/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ManutencaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ManutencaoError(
            'Falha ao obter manutenção',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createManutencao(
    data: CreateManutencaoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateManutencaoDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/manutencoes', data)

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

  public async updateManutencao(
    id: string,
    data: UpdateManutencaoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateManutencaoDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/manutencoes/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ManutencaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ManutencaoError(
          'Falha ao atualizar manutenção',
          undefined,
          error
        )
      }
    })
  }

  public async deleteManutencao(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/manutencoes/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ManutencaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ManutencaoError(
          'Falha ao apagar manutenção',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleManutencoes(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/frotas/manutencoes/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ManutencaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ManutencaoError(
          'Falha ao apagar manutenções',
          undefined,
          error
        )
      }
    })
  }
}

