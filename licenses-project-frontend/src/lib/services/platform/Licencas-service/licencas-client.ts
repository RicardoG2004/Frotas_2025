import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  BloqueioLicencaDTO,
  CreateLicencaDTO,
  LicencaDTO,
  UpdateLicencaDTO,
} from '@/types/dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { LicencaError } from './licenca-error'
import { LicencasAdminClient } from './licencas-admin-client'
import { LicencasFuncionalidadesClient } from './licencas-funcionalidades-client'
import { LicencasUtilizadoresClient } from './licencas-utilizadores-client'

export class LicencasClient extends BaseApiClient {
  public LicencasFuncionalidades: LicencasFuncionalidadesClient
  public LicencasUtilizadores: LicencasUtilizadoresClient
  public Admin: LicencasAdminClient

  constructor(idFuncionalidade: string) {
    super(idFuncionalidade)
    this.LicencasFuncionalidades = new LicencasFuncionalidadesClient(
      idFuncionalidade
    )
    this.LicencasUtilizadores = new LicencasUtilizadoresClient(idFuncionalidade)
    this.Admin = new LicencasAdminClient(idFuncionalidade)
  }

  // Copy methods from original file lines 358-612
  public async getLicencasPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<LicencaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/api/licencas/licencas-paginated',
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<LicencaDTO>
          >('/api/licencas/licencas-paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new LicencaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new LicencaError(
            'Falha ao obter licenças paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getLicencas(): Promise<ResponseApi<GSResponse<LicencaDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/api/licencas')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<LicencaDTO[]>>(
              '/api/licencas'
            )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new LicencaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new LicencaError('Falha ao obter licenças', undefined, error)
        }
      })
    )
  }

  public async createLicenca(
    data: CreateLicencaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateLicencaDTO,
          GSResponse<string>
        >('/api/licencas', data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
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

  public async updateLicenca(
    id: string,
    data: UpdateLicencaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateLicencaDTO,
          GSResponse<string>
        >(`/api/licencas/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
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

  public async deleteLicenca(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          `/api/licencas/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaError('Falha ao deletar licença', undefined, error)
      }
    })
  }

  public async getLicencaById(
    id: string
  ): Promise<ResponseApi<GSResponse<LicencaDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/api/licencas/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<LicencaDTO>
          >(`/api/licencas/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new LicencaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new LicencaError(
            'Falha ao obter licença por ID',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createLicencaApiKey(
    licencaId: string
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          null,
          GSResponse<string>
        >(`/api/keys/${licencaId}/create`, null)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaError('Falha ao criar API key', undefined, error)
      }
    })
  }

  public async blockLicenca(
    licencaId: string,
    data: BloqueioLicencaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          BloqueioLicencaDTO,
          GSResponse<string>
        >(`/api/licencas/${licencaId}/block`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaError('Falha ao bloquear licença', undefined, error)
      }
    })
  }

  public async unblockLicenca(
    licencaId: string
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          null,
          GSResponse<string>
        >(`/api/licencas/${licencaId}/unblock`, null)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaError('Falha ao desbloquear licença', undefined, error)
      }
    })
  }

  public async deleteMultipleLicencas(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >('/api/licencas/bulk-delete', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaError(
          'Falha ao deletar múltiplas licenças',
          undefined,
          error
        )
      }
    })
  }

  public async getLicencasByCliente(
    clienteId: string
  ): Promise<ResponseApi<GSResponse<LicencaDTO[]>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/api/licencas/by-cliente/${clienteId}`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<LicencaDTO[]>
          >(`/api/licencas/by-cliente/${clienteId}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new LicencaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new LicencaError(
            'Falha ao obter licenças do cliente',
            undefined,
            error
          )
        }
      })
    )
  }

  public async regenerateLicencaApiKey(
    licencaId: string
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          null,
          GSResponse<string>
        >(`/api/keys/${licencaId}/regenerate`, null)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaError('Falha ao regenerar API key', undefined, error)
      }
    })
  }
}
