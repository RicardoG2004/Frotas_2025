import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  SepulturaTipoGeralDTO,
  CreateSepulturaTipoGeralDTO,
  UpdateSepulturaTipoGeralDTO,
} from '@/types/dtos/cemiterios/sepulturas-tipos-geral.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { SepulturaTipoDescricaoError } from './sepulturas-tipos-descricoes-errors'

export class SepulturasTiposDescricoesClient extends BaseApiClient {
  public async getSepulturasTiposDescricoesPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<SepulturaTipoGeralDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/cemiterios/sepulturas/tipos/descricoes/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<SepulturaTipoGeralDTO>
          >(
            state.URL,
            '/client/cemiterios/sepulturas/tipos/descricoes/paginated',
            params
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SepulturaTipoDescricaoError(
              'Formato de resposta inválido'
            )
          }

          return response
        } catch (error) {
          throw new SepulturaTipoDescricaoError(
            'Falha ao obter descrições de tipos de sepulturas paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getSepulturasTiposDescricoes(): Promise<
    ResponseApi<GSResponse<SepulturaTipoGeralDTO[]>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/client/cemiterios/sepulturas/tipos/descricoes'
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<SepulturaTipoGeralDTO[]>
          >(state.URL, '/client/cemiterios/sepulturas/tipos/descricoes')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SepulturaTipoDescricaoError(
              'Formato de resposta inválido'
            )
          }

          return response
        } catch (error) {
          throw new SepulturaTipoDescricaoError(
            'Falha ao obter descrições de tipos de sepulturas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getSepulturaTipoDescricao(
    id: string
  ): Promise<ResponseApi<GSResponse<SepulturaTipoGeralDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/cemiterios/sepulturas/tipos/descricoes/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<SepulturaTipoGeralDTO>
          >(state.URL, `/client/cemiterios/sepulturas/tipos/descricoes/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new SepulturaTipoDescricaoError(
              'Formato de resposta inválido'
            )
          }

          return response
        } catch (error) {
          throw new SepulturaTipoDescricaoError(
            'Falha ao obter descrição de tipo de sepultura',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createSepulturaTipoDescricao(
    data: CreateSepulturaTipoGeralDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateSepulturaTipoGeralDTO,
          GSResponse<string>
        >(state.URL, '/client/cemiterios/sepulturas/tipos/descricoes', data)

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

  public async updateSepulturaTipoDescricao(
    id: string,
    data: UpdateSepulturaTipoGeralDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateSepulturaTipoGeralDTO,
          GSResponse<string>
        >(
          state.URL,
          `/client/cemiterios/sepulturas/tipos/descricoes/${id}`,
          data
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SepulturaTipoDescricaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SepulturaTipoDescricaoError(
          'Falha ao atualizar descrição de tipo de sepultura',
          undefined,
          error
        )
      }
    })
  }

  public async deleteSepulturaTipoDescricao(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/cemiterios/sepulturas/tipos/descricoes/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SepulturaTipoDescricaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SepulturaTipoDescricaoError(
          'Falha ao apagar descrição de tipo de sepultura',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleSepulturasTiposDescricoes(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/cemiterios/sepulturas/tipos/descricoes/bulk', {
          ids: ids,
        })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new SepulturaTipoDescricaoError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new SepulturaTipoDescricaoError(
          'Falha ao apagar descrições de tipos de sepulturas',
          undefined,
          error
        )
      }
    })
  }
}
