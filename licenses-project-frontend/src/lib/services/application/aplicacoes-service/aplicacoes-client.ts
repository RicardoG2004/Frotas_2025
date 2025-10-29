import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  AplicacaoDTO,
  CreateAplicacaoDTO,
  UpdateAplicacaoDTO,
} from '@/types/dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { AplicacaoError } from './aplicacao-error'

export class AplicacoesClient extends BaseApiClient {
  public async getAplicacoesPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<AplicacaoDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/api/aplicacoes/aplicacoes-paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<AplicacaoDTO>
          >('/api/aplicacoes/aplicacoes-paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new AplicacaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new AplicacaoError(
            'Falha ao obter aplicacoes paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getAplicacoes(): Promise<
    ResponseApi<GSResponse<AplicacaoDTO[]>>
  > {
    const cacheKey = this.getCacheKey('GET', '/api/aplicacoes')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<AplicacaoDTO[]>>(
              '/api/aplicacoes'
            )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new AplicacaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new AplicacaoError(
            'Falha ao obter aplicacoes',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createAplicacao(
    data: CreateAplicacaoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateAplicacaoDTO,
          GSResponse<string>
        >('/api/aplicacoes', data)

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

  public async updateAplicacao(
    id: string,
    data: UpdateAplicacaoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateAplicacaoDTO,
          GSResponse<string>
        >(`/api/aplicacoes/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AplicacaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AplicacaoError(
          'Falha ao atualizar aplicacao',
          undefined,
          error
        )
      }
    })
  }

  public async deleteAplicacao(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          `/api/aplicacoes/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AplicacaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AplicacaoError('Falha ao deletar aplicacao', undefined, error)
      }
    })
  }

  public async deleteMultipleAplicacoes(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >('/api/aplicacoes/bulk-delete', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AplicacaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AplicacaoError(
          'Falha ao deletar múltiplas aplicações',
          undefined,
          error
        )
      }
    })
  }
}
