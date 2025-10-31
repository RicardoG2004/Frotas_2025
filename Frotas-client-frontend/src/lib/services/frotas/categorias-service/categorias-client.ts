import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CategoriaDTO,
  CreateCategoriaDTO,
  UpdateCategoriaDTO,
} from '@/types/dtos/frotas/categorias.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { CategoriaError } from './categorias-errors'

export class CategoriasClient extends BaseApiClient {
  public async getCategoriasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<CategoriaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/categorias/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<CategoriaDTO>
          >(state.URL, '/client/frotas/categorias/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CategoriaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CategoriaError(
            'Falha ao obter categorias paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getCategorias(): Promise<ResponseApi<GSResponse<CategoriaDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/frotas/categorias')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<CategoriaDTO[]>
          >(state.URL, '/client/frotas/categorias')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CategoriaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CategoriaError('Falha ao obter categorias', undefined, error)
        }
      })
    )
  }

  public async getCategoria(
    id: string
  ): Promise<ResponseApi<GSResponse<CategoriaDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/categorias/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<CategoriaDTO>
          >(state.URL, `/client/frotas/categorias/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CategoriaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CategoriaError('Falha ao obter categoria', undefined, error)
        }
      })
    )
  }

  public async createCategoria(
    data: CreateCategoriaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateCategoriaDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/categorias', data)

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

  public async updateCategoria(
    id: string,
    data: UpdateCategoriaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateCategoriaDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/categorias/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CategoriaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CategoriaError('Falha ao atualizar categoria', undefined, error)
      }
    })
  }

  public async deleteCategoria(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/categorias/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CategoriaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CategoriaError('Falha ao apagar categoria', undefined, error)
      }
    })
  }

  public async deleteMultipleCategorias(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/frotas/categorias/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CategoriaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CategoriaError('Falha ao apagar categorias', undefined, error)
      }
    })
  }
}

