import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  EquipamentoDTO,
  CreateEquipamentoDTO,
  UpdateEquipamentoDTO,
} from '@/types/dtos/frotas/equipamentos.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { EquipamentoError } from './equipamentos-errors'

export class EquipamentoClient extends BaseApiClient {
  public async getEquipamentosPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<EquipamentoDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/equipamentos/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<EquipamentoDTO>
          >(
            state.URL,
            '/client/frotas/equipamentos/paginated',
            params
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new EquipamentoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new EquipamentoError(
            'Falha ao obter equipamentos paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getEquipamentos(): Promise<
    ResponseApi<GSResponse<EquipamentoDTO[]>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/client/frotas/equipamentos'
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<EquipamentoDTO[]>
          >(state.URL, '/client/frotas/equipamentos')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new EquipamentoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new EquipamentoError(
            'Falha ao obter equipamentos',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getEquipamento(
    id: string
  ): Promise<ResponseApi<GSResponse<EquipamentoDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/frotas/equipamentos/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<EquipamentoDTO>
          >(state.URL, `/client/frotas/equipamentos/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new EquipamentoError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new EquipamentoError(
            'Falha ao obter equipamento',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createEquipamento(
    data: CreateEquipamentoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateEquipamentoDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/equipamentos', data)

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

  public async updateEquipamento(
    id: string,
    data: UpdateEquipamentoDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateEquipamentoDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/equipamentos/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new EquipamentoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new EquipamentoError(
          'Falha ao atualizar equipamento',
          undefined,
          error
        )
      }
    })
  }

  public async deleteEquipamento(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/frotas/equipamentos/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new EquipamentoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new EquipamentoError(
          'Falha ao apagar equipamento',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleEquipamentos(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/frotas/equipamentos/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new EquipamentoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new EquipamentoError(
          'Falha ao apagar equipamentos',
          undefined,
          error
        )
      }
    })
  }
}

