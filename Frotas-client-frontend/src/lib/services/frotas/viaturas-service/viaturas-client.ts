import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreateViaturaDTO,
  ViaturaDTO,
  UpdateViaturaDTO,
} from '@/types/dtos/frotas/viaturas.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { ViaturaError } from './viaturas-errors'

type ViaturaPaginatedRequest = {
  pageNumber: number
  pageSize: number
  filters: Array<{ id: string; value: string }>
  sorting?: Array<{ id: string; desc: boolean }>
}

export class ViaturasClient extends BaseApiClient {
  constructor(idFuncionalidade: string) {
    super(idFuncionalidade)
  }

  public async getViaturasPaginated(
    params: ViaturaPaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<ViaturaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/viaturas/paginated',
      params
    )

    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            ViaturaPaginatedRequest,
            PaginatedResponse<ViaturaDTO>
          >(state.URL, '/client/frotas/viaturas/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ViaturaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ViaturaError(
            'Falha ao obter viaturas paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getViaturas(): Promise<ResponseApi<GSResponse<ViaturaDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/frotas/viaturas')

    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<ViaturaDTO[]>>(
              state.URL,
              '/client/frotas/viaturas'
            )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ViaturaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ViaturaError(
            'Falha ao obter viaturas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getViatura(
    id: string
  ): Promise<ResponseApi<GSResponse<ViaturaDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/frotas/viaturas/${id}`)

    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<ViaturaDTO>>(
              state.URL,
              `/client/frotas/viaturas/${id}`
            )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ViaturaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ViaturaError(
            'Falha ao obter viatura',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createViatura(
    data: CreateViaturaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateViaturaDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/viaturas', data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ViaturaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        if (error instanceof BaseApiError && error.data) {
          return {
            info: error.data as GSResponse<string>,
            status: error.statusCode || 400,
            statusText: error.message,
          }
        }

        throw new ViaturaError(
          'Falha ao criar viatura',
          undefined,
          error
        )
      }
    })
  }

  public async updateViatura(
    id: string,
    data: UpdateViaturaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateViaturaDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/viaturas/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ViaturaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ViaturaError(
          'Falha ao atualizar viatura',
          undefined,
          error
        )
      }
    })
  }

  public async deleteViatura(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response =
          await this.httpClient.deleteRequest<GSGenericResponse>(
            state.URL,
            `/client/frotas/viaturas/${id}`
          )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ViaturaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ViaturaError(
          'Falha ao remover viatura',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleViaturas(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response =
          await this.httpClient.deleteRequestWithBody<
            { ids: string[] },
            GSGenericResponse
          >(state.URL, '/client/frotas/viaturas/bulk', { ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ViaturaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ViaturaError(
          'Falha ao remover viaturas',
          undefined,
          error
        )
      }
    })
  }
}

