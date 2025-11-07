import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreateLocalizacaoDTO,
  LocalizacaoDTO,
  UpdateLocalizacaoDTO,
} from '@/types/dtos/base/localizacoes.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { LocalizacaoError } from './localizacoes-errors'

export class LocalizacoesClient extends BaseApiClient {
  public async getLocalizacoesPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<LocalizacaoDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/base/localizacoes/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<LocalizacaoDTO>
          >(state.URL, '/client/base/localizacoes/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new LocalizacaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new LocalizacaoError(
            'Falha ao obter localizações paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getLocalizacoes(): Promise<
    ResponseApi<GSResponse<LocalizacaoDTO[]>>
  > {
    const cacheKey = this.getCacheKey('GET', '/client/base/localizacoes')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<LocalizacaoDTO[]>
          >(state.URL, '/client/base/localizacoes')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new LocalizacaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new LocalizacaoError(
            'Falha ao obter localizações',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getLocalizacao(
    id: string
  ): Promise<ResponseApi<GSResponse<LocalizacaoDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/base/localizacoes/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<LocalizacaoDTO>
          >(state.URL, `/client/base/localizacoes/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new LocalizacaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new LocalizacaoError(
            'Falha ao obter localização',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createLocalizacao(
    data: CreateLocalizacaoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateLocalizacaoDTO,
          GSResponse<string>
        >(state.URL, '/client/base/localizacoes', data)

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

  public async updateLocalizacao(
    id: string,
    data: UpdateLocalizacaoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateLocalizacaoDTO,
          GSResponse<string>
        >(state.URL, `/client/base/localizacoes/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LocalizacaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LocalizacaoError(
          'Falha ao atualizar localização',
          undefined,
          error
        )
      }
    })
  }

  public async deleteLocalizacao(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/base/localizacoes/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LocalizacaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LocalizacaoError(
          'Falha ao apagar localização',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleLocalizacoes(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/base/localizacoes/bulk', { ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LocalizacaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LocalizacaoError(
          'Falha ao apagar múltiplas localizações',
          undefined,
          error
        )
      }
    })
  }
}

