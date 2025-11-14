import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CargoDTO,
  CreateCargoDTO,
  UpdateCargoDTO,
} from '@/types/dtos/base/cargos.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { CargoError } from './cargos-errors'

const BASE_ROUTE = '/client/base/cargos'

export class CargosClient extends BaseApiClient {
  public async getCargosPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<CargoDTO>>> {
    const cacheKey = this.getCacheKey('POST', `${BASE_ROUTE}/paginated`, params)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<CargoDTO>
          >(state.URL, `${BASE_ROUTE}/paginated`, params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CargoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CargoError(
            'Falha ao obter cargos paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getCargos(): Promise<ResponseApi<GSResponse<CargoDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', BASE_ROUTE)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<CargoDTO[]>
          >(state.URL, BASE_ROUTE)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CargoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CargoError('Falha ao obter cargos', undefined, error)
        }
      })
    )
  }

  public async getCargo(id: string): Promise<ResponseApi<GSResponse<CargoDTO>>> {
    const cacheKey = this.getCacheKey('GET', `${BASE_ROUTE}/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<CargoDTO>
          >(state.URL, `${BASE_ROUTE}/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CargoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CargoError('Falha ao obter cargo', undefined, error)
        }
      })
    )
  }

  public async createCargo(
    data: CreateCargoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateCargoDTO,
          GSResponse<string>
        >(state.URL, BASE_ROUTE, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CargoError('Formato de resposta inválido')
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
        throw new CargoError('Falha ao criar cargo', undefined, error)
      }
    })
  }

  public async updateCargo(
    id: string,
    data: UpdateCargoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateCargoDTO,
          GSResponse<string>
        >(state.URL, `${BASE_ROUTE}/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CargoError('Formato de resposta inválido')
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
        throw new CargoError('Falha ao atualizar cargo', undefined, error)
      }
    })
  }

  public async deleteCargo(
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
          throw new CargoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CargoError('Falha ao apagar cargo', undefined, error)
      }
    })
  }

  public async deleteMultipleCargos(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, `${BASE_ROUTE}/bulk`, { ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CargoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CargoError('Falha ao apagar cargos', undefined, error)
      }
    })
  }
}


