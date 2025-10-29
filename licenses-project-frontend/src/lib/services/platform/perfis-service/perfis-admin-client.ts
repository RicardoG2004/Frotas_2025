import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreatePerfilDTO,
  PerfilDTO,
  PerfilFuncionalidadeDTO,
  UpdatePerfilDTO,
  LicencaPerfilUtilizadoresDTO,
} from '@/types/dtos'
import {
  ResponseApi,
  ResponsePerfilModulosFuncionalidades,
} from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { PerfilError } from './perfil-error'

export class PerfilAdminClient extends BaseApiClient {
  constructor(idFuncionalidade: string) {
    super(idFuncionalidade)
  }

  public async getPerfisPaginated(
    licencaId: string,
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<PerfilDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      `/api/perfis/licenca/${licencaId}/perfis-paginated`,
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<PerfilDTO>
          >(`/api/perfis/licenca/${licencaId}/perfis-paginated`, params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PerfilError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new PerfilError(
            'Falha ao obter perfis paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getPerfis(
    licencaId: string,
    keyword: string = ''
  ): Promise<ResponseApi<GSResponse<PerfilDTO[]>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/api/perfis/licenca/${licencaId}`,
      { keyword }
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<PerfilDTO[]>
          >(
            `/api/perfis/licenca/${licencaId}${keyword ? `?keyword=${keyword}` : ''}`
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PerfilError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new PerfilError('Falha ao obter perfis', undefined, error)
        }
      })
    )
  }

  public async createPerfil(
    licencaId: string,
    data: CreatePerfilDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreatePerfilDTO,
          GSResponse<string>
        >(`/api/perfis/licenca/${licencaId}/create`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PerfilError('Formato de resposta inválido')
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

  public async updatePerfil(
    licencaId: string,
    id: string,
    data: UpdatePerfilDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdatePerfilDTO,
          GSResponse<string>
        >(`/api/perfis/licenca/${licencaId}/perfil/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PerfilError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PerfilError('Falha ao atualizar perfil', undefined, error)
      }
    })
  }

  public async deletePerfil(
    licencaId: string,
    id: string
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<
          GSResponse<string>
        >(`/api/perfis/licenca/${licencaId}/perfil/${id}`)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PerfilError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PerfilError('Falha ao deletar perfil', undefined, error)
      }
    })
  }

  public async getPerfilById(
    id: string
  ): Promise<ResponseApi<GSResponse<PerfilDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/api/perfis/admin/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<PerfilDTO>
          >(`/api/perfis/admin/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PerfilError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new PerfilError(
            'Falha ao obter perfil por ID',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getPerfisModulosFuncionalidades(
    id: string
  ): Promise<ResponseApi<GSResponse<ResponsePerfilModulosFuncionalidades>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/api/perfis/${id}/funcionalidades/tree`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ResponsePerfilModulosFuncionalidades>
          >(`/api/perfis/${id}/funcionalidades/tree`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PerfilError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new PerfilError('Falha ao obter perfis', undefined, error)
        }
      })
    )
  }

  public async updatePerfilFuncionalidades(
    perfilId: string,
    data: PerfilFuncionalidadeDTO[]
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          PerfilFuncionalidadeDTO[],
          GSResponse<string>
        >(`/api/perfis/${perfilId}/funcionalidades`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PerfilError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PerfilError(
          'Falha ao atualizar funcionalidades do perfil',
          undefined,
          error
        )
      }
    })
  }

  public async addUtilizadorPerfil(
    perfilId: string,
    utilizadorId: string
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postWithoutDataRequest<
          GSResponse<string>
        >(`/api/perfis/${perfilId}/utilizadores/${utilizadorId}`)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PerfilError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PerfilError(
          'Falha ao adicionar utilizador ao perfil',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultiplePerfis(
    licencaId: string,
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(`/api/perfis/licenca/${licencaId}/bulk-delete`, { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new PerfilError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new PerfilError(
          'Falha ao remover múltiplos perfis',
          undefined,
          error
        )
      }
    })
  }

  public async getPerfisUtilizadoresFromLicenca(
    licencaId: string,
    role?: string
  ): Promise<ResponseApi<GSResponse<LicencaPerfilUtilizadoresDTO>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/api/licencas/${licencaId}/perfis/utilizadores${role ? `?role=${role}` : ''}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<LicencaPerfilUtilizadoresDTO>
          >(
            `/api/licencas/${licencaId}/perfis/utilizadores${role ? `?role=${role}` : ''}`
          )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new PerfilError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new PerfilError(
            'Falha ao obter utilizadores dos perfis da licença',
            undefined,
            error
          )
        }
      })
    )
  }
}
