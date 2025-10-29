import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CemiterioDTO,
  CreateCemiterioDTO,
  UpdateCemiterioDTO,
} from '@/types/dtos/cemiterios/cemiterios.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { CemiterioError } from './cemiterios-errors'

export class CemiteriosClient extends BaseApiClient {
  public async getCemiteriosPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<CemiterioDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/cemiterios/cemiterios/paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<CemiterioDTO>
          >(state.URL, '/client/cemiterios/cemiterios/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CemiterioError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CemiterioError(
            'Falha ao obter cemitérios paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getCemiterios(): Promise<
    ResponseApi<GSResponse<CemiterioDTO[]>>
  > {
    const cacheKey = this.getCacheKey('GET', '/client/cemiterios')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<CemiterioDTO[]>
          >(state.URL, '/client/cemiterios/cemiterios')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CemiterioError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CemiterioError(
            'Falha ao obter cemitérios',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getCemiterio(
    id: string
  ): Promise<ResponseApi<GSResponse<CemiterioDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/cemiterios/cemiterios/${id}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<CemiterioDTO>
          >(state.URL, `/client/cemiterios/cemiterios/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CemiterioError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CemiterioError('Falha ao obter cemitério', undefined, error)
        }
      })
    )
  }

  public async createCemiterio(
    data: CreateCemiterioDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateCemiterioDTO,
          GSResponse<string>
        >(state.URL, '/client/cemiterios/cemiterios', data)

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

  public async updateCemiterio(
    id: string,
    data: UpdateCemiterioDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateCemiterioDTO,
          GSResponse<string>
        >(state.URL, `/client/cemiterios/cemiterios/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CemiterioError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CemiterioError(
          'Falha ao atualizar cemitérios',
          undefined,
          error
        )
      }
    })
  }

  public async deleteCemiterio(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/cemiterios/cemiterios/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CemiterioError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CemiterioError('Falha ao apagar cemitério', undefined, error)
      }
    })
  }

  public async deleteMultipleCemiterios(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/cemiterios/cemiterios/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CemiterioError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CemiterioError('Falha ao apagar cemitérios', undefined, error)
      }
    })
  }

  public async uploadCemiterioSvg(
    svgFile: File,
    fileName: string
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const formData = new FormData()
        formData.append('SvgFile', svgFile)
        formData.append('FileName', fileName)

        const response = await this.httpClient.postRequest<
          FormData,
          GSResponse<string>
        >(state.URL, '/client/cemiterios/cemiterios/upload-svg', formData)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new CemiterioError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new CemiterioError(
          'Falha ao fazer upload do SVG',
          undefined,
          error
        )
      }
    })
  }

  public async getPredefinedCemiterio(): Promise<
    ResponseApi<GSResponse<CemiterioDTO>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/client/cemiterios/cemiterios/predefinido'
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<CemiterioDTO>
          >(state.URL, '/client/cemiterios/cemiterios/predefinido')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CemiterioError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CemiterioError(
            'Falha ao obter cemitério predefinido',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getCemiterioSvg(
    id: string
  ): Promise<ResponseApi<GSResponse<string>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/client/cemiterios/cemiterios/${id}/svg`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<GSResponse<string>>(
            state.URL,
            `/client/cemiterios/cemiterios/${id}/svg`
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new CemiterioError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new CemiterioError(
            'Falha ao obter SVG do cemitério',
            undefined,
            error
          )
        }
      })
    )
  }
}
