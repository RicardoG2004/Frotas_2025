import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  UtilizacaoDTO,
  CreateUtilizacaoDTO,
  UpdateUtilizacaoDTO,
} from '@/types/dtos/frotas/utilizacoes.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { UtilizacaoError } from './utilizacoes-errors'

export class UtilizacaoClient extends BaseApiClient {
  public async getUtilizacoesPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<UtilizacaoDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/utilizacoes/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<UtilizacaoDTO>
          >(
            state.URL,
            '/client/frotas/utilizacoes/paginated',
            params
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new UtilizacaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new UtilizacaoError(
            'Falha ao obter utilizações paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getUtilizacoes(): Promise<
    ResponseApi<GSResponse<UtilizacaoDTO[]>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/client/frotas/utilizacoes'
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<UtilizacaoDTO[]>
          >(state.URL, '/client/frotas/utilizacoes')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new UtilizacaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new UtilizacaoError(
            'Falha ao obter utilizações',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getUtilizacao(
    id: string
  ): Promise<ResponseApi<GSResponse<UtilizacaoDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/utilizacoes/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<UtilizacaoDTO>
          >(state.URL, `/client/frotas/utilizacoes/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new UtilizacaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new UtilizacaoError(
            'Falha ao obter utilização',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getUtilizacoesByFuncionario(
    funcionarioId: string
  ): Promise<ResponseApi<GSResponse<UtilizacaoDTO[]>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/utilizacoes/funcionario/${funcionarioId}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<UtilizacaoDTO[]>
          >(state.URL, `/client/frotas/utilizacoes/funcionario/${funcionarioId}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new UtilizacaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new UtilizacaoError(
            'Falha ao obter utilizações por funcionário',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getUtilizacoesByDate(
    date: string
  ): Promise<ResponseApi<GSResponse<UtilizacaoDTO[]>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/utilizacoes/data/${date}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<UtilizacaoDTO[]>
          >(state.URL, `/client/frotas/utilizacoes/data/${date}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new UtilizacaoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new UtilizacaoError(
            'Falha ao obter utilizações por data',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createUtilizacao(
    data: CreateUtilizacaoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        console.log('Enviando POST para:', '/client/frotas/utilizacoes', data)
        const response = await this.httpClient.postRequest<
          CreateUtilizacaoDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/utilizacoes', data)

        console.log('Resposta recebida:', response)
        
        if (!response.info) {
          console.error('Resposta sem info:', response)
          throw new UtilizacaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        console.error('Erro ao criar utilização:', error)
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

  public async updateUtilizacao(
    id: string,
    data: UpdateUtilizacaoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateUtilizacaoDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/utilizacoes/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new UtilizacaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new UtilizacaoError(
          'Falha ao atualizar utilização',
          undefined,
          error
        )
      }
    })
  }

  public async deleteUtilizacao(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/utilizacoes/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new UtilizacaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new UtilizacaoError(
          'Falha ao apagar utilização',
          undefined,
          error
        )
      }
    })
  }
}

