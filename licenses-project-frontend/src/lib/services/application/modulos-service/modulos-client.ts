import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import { ModuloDTO, CreateModuloDTO, UpdateModuloDTO } from '@/types/dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { ModuloError } from './modulo-error'

export class ModulosClient extends BaseApiClient {
  public async getModulosPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<ModuloDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/api/modulos/modulos-paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<ModuloDTO>
          >('/api/modulos/modulos-paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ModuloError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ModuloError(
            'Falha ao obter módulos paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getModulos(
    aplicacaoId?: string
  ): Promise<ResponseApi<GSResponse<ModuloDTO[]>>> {
    const endpoint = aplicacaoId
      ? `/api/modulos?aplicacaoId=${aplicacaoId}`
      : '/api/modulos'

    const cacheKey = this.getCacheKey('GET', endpoint)

    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<ModuloDTO[]>>(endpoint)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ModuloError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ModuloError('Falha ao obter módulos', undefined, error)
        }
      })
    )
  }

  public async createModulo(
    data: CreateModuloDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateModuloDTO,
          GSResponse<string>
        >('/api/modulos', data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ModuloError('Formato de resposta inválido')
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
        throw error
      }
    })
  }

  public async updateModulo(
    id: string,
    data: UpdateModuloDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateModuloDTO,
          GSResponse<string>
        >(`/api/modulos/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ModuloError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ModuloError('Falha ao atualizar módulo', undefined, error)
      }
    })
  }

  public async deleteModulo(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          `/api/modulos/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ModuloError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ModuloError('Falha ao deletar módulo', undefined, error)
      }
    })
  }

  public async deleteMultipleModulos(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >('/api/modulos/bulk-delete', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ModuloError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ModuloError(
          'Falha ao deletar múltiplos módulos',
          undefined,
          error
        )
      }
    })
  }
}
