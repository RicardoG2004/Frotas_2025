import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
} from '@/types/api/responses'
import { PaginatedResponse } from '@/types/api/responses'
import {
  CreateSetorDTO,
  SetorDTO,
  UpdateSetorDTO,
} from '@/types/dtos/base/setores.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient } from '@/lib/base-client'
import { SetorError } from './setores-errors'

export class SetoresClient extends BaseApiClient {
  public async getSetoresPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<SetorDTO>>> {
    const cacheKey = this.getCacheKey('POST', '/api/setores/paginated', params)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<SetorDTO>
          >(state.URL, '/client/base/setores/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SetorError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          console.error('Falha ao obter setores paginados:', error)
          throw new SetorError(
            'Falha ao obter setores paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getSetores(): Promise<ResponseApi<GSResponse<SetorDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/base/setores')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<SetorDTO[]>
          >(state.URL, '/client/base/setores')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SetorError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new SetorError('Falha ao obter setores', undefined, error)
        }
      })
    )
  }

  public async getSetor(id: string): Promise<ResponseApi<GSResponse<SetorDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/base/setores/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<SetorDTO>
          >(state.URL, `/client/base/setores/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SetorError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new SetorError('Falha ao obter setor', undefined, error)
        }
      })
    )
  }

  public async createSetor(
    data: CreateSetorDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateSetorDTO,
          GSResponse<string>
        >(state.URL, '/client/base/setores', data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SetorError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SetorError('Falha ao criar setor', undefined, error)
      }
    })
  }

  public async updateSetor(
    id: string,
    data: UpdateSetorDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateSetorDTO,
          GSResponse<string>
        >(state.URL, `/client/base/setores/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SetorError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SetorError('Falha ao atualizar setor', undefined, error)
      }
    })
  }

  public async deleteSetor(id: string): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/base/setores/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SetorError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SetorError('Falha ao apagar setor', undefined, error)
      }
    })
  }

  public async deleteMultipleSetores(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/base/setores/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SetorError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SetorError(
          'Falha ao apagar múltiplos setores',
          undefined,
          error
        )
      }
    })
  }
}

