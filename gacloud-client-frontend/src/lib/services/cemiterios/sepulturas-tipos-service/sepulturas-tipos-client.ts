import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  SepulturaTipoDTO,
  CreateSepulturaTipoDTO,
  UpdateSepulturaTipoDTO,
} from '@/types/dtos/cemiterios/sepulturas-tipos.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { SepulturaTipoError } from './sepulturas-tipos-errors'

export class SepulturasTiposClient extends BaseApiClient {
  public async getSepulturasTiposPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<SepulturaTipoDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/cemiterios/sepulturas/tipos/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<SepulturaTipoDTO>
          >(state.URL, '/client/cemiterios/sepulturas/tipos/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SepulturaTipoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new SepulturaTipoError(
            'Falha ao obter tipos de sepulturas paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getSepulturasTipos(): Promise<
    ResponseApi<GSResponse<SepulturaTipoDTO[]>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/client/cemiterios/sepulturas/tipos'
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<SepulturaTipoDTO[]>
          >(state.URL, '/client/cemiterios/sepulturas/tipos')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SepulturaTipoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new SepulturaTipoError(
            'Falha ao obter tipos de sepulturas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getSepulturaTipo(
    id: string
  ): Promise<ResponseApi<GSResponse<SepulturaTipoDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/cemiterios/sepulturas/tipos/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<SepulturaTipoDTO>
          >(state.URL, `/client/cemiterios/sepulturas/tipos/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SepulturaTipoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new SepulturaTipoError(
            'Falha ao obter tipo de sepultura',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createSepulturaTipo(
    data: CreateSepulturaTipoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateSepulturaTipoDTO,
          GSResponse<string>
        >(state.URL, '/client/cemiterios/sepulturas/tipos', data)

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

  public async updateSepulturaTipo(
    id: string,
    data: UpdateSepulturaTipoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateSepulturaTipoDTO,
          GSResponse<string>
        >(state.URL, `/client/cemiterios/sepulturas/tipos/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SepulturaTipoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SepulturaTipoError(
          'Falha ao atualizar tipo de sepultura',
          undefined,
          error
        )
      }
    })
  }

  public async deleteSepulturaTipo(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/cemiterios/sepulturas/tipos/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SepulturaTipoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SepulturaTipoError(
          'Falha ao apagar tipo de sepultura',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleSepulturasTipos(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/cemiterios/sepulturas/tipos/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SepulturaTipoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SepulturaTipoError(
          'Falha ao apagar tipos de sepulturas',
          undefined,
          error
        )
      }
    })
  }
}
