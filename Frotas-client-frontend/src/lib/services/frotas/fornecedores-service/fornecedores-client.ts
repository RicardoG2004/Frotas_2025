import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  FornecedorDTO,
  CreateFornecedorDTO,
  UpdateFornecedorDTO,
} from '@/types/dtos/frotas/fornecedores.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { FornecedorError } from './fornecedores-errors'

export class FornecedoresClient extends BaseApiClient {
  public async getFornecedoresPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<FornecedorDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/fornecedores/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<FornecedorDTO>
          >(state.URL, '/client/frotas/fornecedores/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new FornecedorError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new FornecedorError(
            'Falha ao obter fornecedores paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getFornecedores(): Promise<ResponseApi<GSResponse<FornecedorDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/frotas/fornecedores')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<FornecedorDTO[]>
          >(state.URL, '/client/frotas/fornecedores')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new FornecedorError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new FornecedorError('Falha ao obter fornecedores', undefined, error)
        }
      })
    )
  }

  public async getFornecedor(
    id: string
  ): Promise<ResponseApi<GSResponse<FornecedorDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/fornecedores/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<FornecedorDTO>
          >(state.URL, `/client/frotas/fornecedores/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new FornecedorError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new FornecedorError('Falha ao obter fornecedor', undefined, error)
        }
      })
    )
  }

  public async createFornecedor(
    data: CreateFornecedorDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateFornecedorDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/fornecedores', data)

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

  public async updateFornecedor(
    id: string,
    data: UpdateFornecedorDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateFornecedorDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/fornecedores/${id}`, data)

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

  public async deleteFornecedor(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/fornecedores/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new FornecedorError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new FornecedorError('Falha ao apagar fornecedor', undefined, error)
      }
    })
  }

  public async deleteMultipleFornecedores(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/frotas/fornecedores/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new FornecedorError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new FornecedorError('Falha ao apagar fornecedores', undefined, error)
      }
    })
  }
}

