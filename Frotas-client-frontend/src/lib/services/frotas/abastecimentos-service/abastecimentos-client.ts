import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  AbastecimentoDTO,
  CreateAbastecimentoDTO,
  UpdateAbastecimentoDTO,
} from '@/types/dtos/frotas/abastecimentos.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { AbastecimentoError } from './abastecimentos-errors'

export class AbastecimentoClient extends BaseApiClient {
  public async getAbastecimentosPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<AbastecimentoDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/abastecimentos/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<AbastecimentoDTO>
          >(
            state.URL,
            '/client/frotas/abastecimentos/paginated',
            params
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new AbastecimentoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new AbastecimentoError(
            'Falha ao obter abastecimentos paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getAbastecimentos(): Promise<
    ResponseApi<GSResponse<AbastecimentoDTO[]>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/client/frotas/abastecimentos'
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<AbastecimentoDTO[]>
          >(state.URL, '/client/frotas/abastecimentos')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new AbastecimentoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new AbastecimentoError(
            'Falha ao obter abastecimentos',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getAbastecimento(
    id: string
  ): Promise<ResponseApi<GSResponse<AbastecimentoDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/abastecimentos/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<AbastecimentoDTO>
          >(state.URL, `/client/frotas/abastecimentos/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new AbastecimentoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new AbastecimentoError(
            'Falha ao obter abastecimento',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getAbastecimentosByFuncionario(
    funcionarioId: string
  ): Promise<ResponseApi<GSResponse<AbastecimentoDTO[]>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/abastecimentos/funcionario/${funcionarioId}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<AbastecimentoDTO[]>
          >(state.URL, `/client/frotas/abastecimentos/funcionario/${funcionarioId}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new AbastecimentoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new AbastecimentoError(
            'Falha ao obter abastecimentos por funcionário',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getAbastecimentosByDate(
    date: string
  ): Promise<ResponseApi<GSResponse<AbastecimentoDTO[]>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/abastecimentos/data/${date}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<AbastecimentoDTO[]>
          >(state.URL, `/client/frotas/abastecimentos/data/${date}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new AbastecimentoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new AbastecimentoError(
            'Falha ao obter abastecimentos por data',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createAbastecimento(
    data: CreateAbastecimentoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        console.log('Enviando POST para:', '/client/frotas/abastecimentos', data)
        const response = await this.httpClient.postRequest<
          CreateAbastecimentoDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/abastecimentos', data)

        console.log('Resposta recebida:', response)
        
        if (!response.info) {
          console.error('Resposta sem info:', response)
          throw new AbastecimentoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        console.error('Erro ao criar abastecimento:', error)
        console.error('Erro completo:', JSON.stringify(error, null, 2))
        if (error instanceof BaseApiError && error.data) {
          console.log('Erro data:', error.data)
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

  public async updateAbastecimento(
    id: string,
    data: UpdateAbastecimentoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateAbastecimentoDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/abastecimentos/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AbastecimentoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AbastecimentoError(
          'Falha ao atualizar abastecimento',
          undefined,
          error
        )
      }
    })
  }

  public async deleteAbastecimento(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/abastecimentos/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new AbastecimentoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new AbastecimentoError(
          'Falha ao apagar abastecimento',
          undefined,
          error
        )
      }
    })
  }
}

