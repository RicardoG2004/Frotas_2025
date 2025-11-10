import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreateTipoViaturaDTO,
  TipoViaturaDTO,
  UpdateTipoViaturaDTO,
} from '@/types/dtos/frotas/tipo-viaturas.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { TipoViaturaError } from './tipo-viaturas-errors'

type TipoViaturaPaginatedRequest = {
  pageNumber: number
  pageSize: number
  filters: Array<{ id: string; value: string }>
  sorting?: Array<{ id: string; desc: boolean }>
}

export class TipoViaturaClient extends BaseApiClient {
  public async getTipoViaturasPaginated(
    params: TipoViaturaPaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<TipoViaturaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/tipo-viaturas/paginated',
      params
    )

    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            TipoViaturaPaginatedRequest,
            PaginatedResponse<TipoViaturaDTO>
          >(state.URL, '/client/frotas/tipo-viaturas/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new TipoViaturaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new TipoViaturaError(
            'Falha ao obter tipos de viatura paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getTipoViaturas(): Promise<
    ResponseApi<GSResponse<TipoViaturaDTO[]>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/client/frotas/tipo-viaturas'
    )

    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<TipoViaturaDTO[]>>(
              state.URL,
              '/client/frotas/tipo-viaturas'
            )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new TipoViaturaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new TipoViaturaError(
            'Falha ao obter tipos de viatura',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getTipoViatura(
    id: string
  ): Promise<ResponseApi<GSResponse<TipoViaturaDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/tipo-viaturas/${id}`
    )

    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<TipoViaturaDTO>>(
              state.URL,
              `/client/frotas/tipo-viaturas/${id}`
            )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new TipoViaturaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new TipoViaturaError(
            'Falha ao obter tipo de viatura',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createTipoViatura(
    data: CreateTipoViaturaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateTipoViaturaDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/tipo-viaturas', data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TipoViaturaError('Formato de resposta inválido')
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

        throw new TipoViaturaError(
          'Falha ao criar tipo de viatura',
          undefined,
          error
        )
      }
    })
  }

  public async updateTipoViatura(
    id: string,
    data: UpdateTipoViaturaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateTipoViaturaDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/tipo-viaturas/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TipoViaturaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TipoViaturaError(
          'Falha ao atualizar tipo de viatura',
          undefined,
          error
        )
      }
    })
  }

  public async deleteTipoViatura(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response =
          await this.httpClient.deleteRequest<GSGenericResponse>(
            state.URL,
            `/client/frotas/tipo-viaturas/${id}`
          )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TipoViaturaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TipoViaturaError(
          'Falha ao remover tipo de viatura',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleTipoViaturas(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response =
          await this.httpClient.deleteRequestWithBody<
            { ids: string[] },
            GSGenericResponse
          >(state.URL, '/client/frotas/tipo-viaturas/bulk', { ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TipoViaturaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TipoViaturaError(
          'Falha ao remover tipos de viatura',
          undefined,
          error
        )
      }
    })
  }
}

