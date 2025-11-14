import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreateFuncionarioDTO,
  FuncionarioDTO,
  UpdateFuncionarioDTO,
} from '@/types/dtos/base/funcionarios.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { FuncionarioError } from './funcionarios-errors'

const BASE_ROUTE = '/client/base/funcionarios'

export class FuncionariosClient extends BaseApiClient {
  public async getFuncionariosPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<FuncionarioDTO>>> {
    const cacheKey = this.getCacheKey('POST', `${BASE_ROUTE}/paginated`, params)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<FuncionarioDTO>
          >(state.URL, `${BASE_ROUTE}/paginated`, params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new FuncionarioError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new FuncionarioError(
            'Falha ao obter funcionários paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getFuncionarios(): Promise<
    ResponseApi<GSResponse<FuncionarioDTO[]>>
  > {
    const cacheKey = this.getCacheKey('GET', BASE_ROUTE)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<FuncionarioDTO[]>
          >(state.URL, BASE_ROUTE)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new FuncionarioError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new FuncionarioError(
            'Falha ao obter funcionários',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getFuncionario(
    id: string
  ): Promise<ResponseApi<GSResponse<FuncionarioDTO>>> {
    const cacheKey = this.getCacheKey('GET', `${BASE_ROUTE}/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<FuncionarioDTO>
          >(state.URL, `${BASE_ROUTE}/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new FuncionarioError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new FuncionarioError(
            'Falha ao obter funcionário',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createFuncionario(
    data: CreateFuncionarioDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        return await this.httpClient.postRequest<
          CreateFuncionarioDTO,
          GSResponse<string>
        >(state.URL, BASE_ROUTE, data)
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

  public async updateFuncionario(
    id: string,
    data: UpdateFuncionarioDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        return await this.httpClient.putRequest<
          UpdateFuncionarioDTO,
          GSResponse<string>
        >(state.URL, `${BASE_ROUTE}/${id}`, data)
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

  public async deleteFuncionario(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `${BASE_ROUTE}/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new FuncionarioError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new FuncionarioError(
          'Falha ao apagar funcionário',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleFuncionarios(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response =
          await this.httpClient.deleteRequestWithBody<
            { ids: string[] },
            GSGenericResponse
          >(state.URL, `${BASE_ROUTE}/bulk`, { ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new FuncionarioError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new FuncionarioError(
          'Falha ao apagar funcionários',
          undefined,
          error
        )
      }
    })
  }
}


