import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  ServicoDTO,
  CreateServicoDTO,
  UpdateServicoDTO,
} from '@/types/dtos/frotas/servicos.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { ServicoError } from './servicos-errors'

export class ServicoClient extends BaseApiClient {
  public async getServicosPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<ServicoDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/servicos/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<ServicoDTO>
          >(
            state.URL,
            '/client/frotas/servicos/paginated',
            params
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ServicoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ServicoError(
            'Falha ao obter serviços paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getServicos(): Promise<
    ResponseApi<GSResponse<ServicoDTO[]>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/client/frotas/servicos'
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ServicoDTO[]>
          >(state.URL, '/client/frotas/servicos')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ServicoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ServicoError(
            'Falha ao obter serviços',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getServico(
    id: string
  ): Promise<ResponseApi<GSResponse<ServicoDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/servicos/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ServicoDTO>
          >(state.URL, `/client/frotas/servicos/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ServicoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ServicoError(
            'Falha ao obter serviço',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createServico(
    data: CreateServicoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateServicoDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/servicos', data)

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

  public async updateServico(
    id: string,
    data: UpdateServicoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateServicoDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/servicos/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ServicoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ServicoError(
          'Falha ao atualizar serviço',
          undefined,
          error
        )
      }
    })
  }

  public async deleteServico(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/servicos/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ServicoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ServicoError(
          'Falha ao apagar serviço',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleServicos(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/frotas/servicos/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ServicoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ServicoError(
          'Falha ao apagar serviços',
          undefined,
          error
        )
      }
    })
  }
}

