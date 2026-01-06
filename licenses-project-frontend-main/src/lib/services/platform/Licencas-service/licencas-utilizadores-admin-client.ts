import { GSGenericResponse, GSResponse } from '@/types/api/responses'
import { PaginatedRequest, PaginatedResponse } from '@/types/api/responses'
import {
  CreateUtilizadorDTO,
  UpdateUtilizadorDTO,
  UtilizadorDTO,
  LicencaUtilizadorDTO,
} from '@/types/dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient } from '@/lib/base-client'
import { LicencaError } from './licenca-error'

export class LicencasUtilizadoresAdminClient extends BaseApiClient {
  constructor(idFuncionalidade: string) {
    super(idFuncionalidade)
  }

  // Copy methods from original file lines 129-255
  public async getUtilizadores(
    clienteId: string
  ): Promise<ResponseApi<GSResponse<UtilizadorDTO[]>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.getRequest<
          GSResponse<UtilizadorDTO[]>
        >(`/api/identity/clientes/${clienteId}/users/list`)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaError(
          'Falha ao obter utilizadores admin',
          undefined,
          error
        )
      }
    })
  }

  public async createUser(
    data: CreateUtilizadorDTO
  ): Promise<ResponseApi<GSResponse<UtilizadorDTO>>> {
    return this.withRetry(async () => {
      try {
        console.log('Creating user with data:', data)
        const response = await this.httpClient.postRequest<
          CreateUtilizadorDTO,
          GSResponse<UtilizadorDTO>
        >('/api/identity/users/create', data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        console.log('Create user response:', response)
        return response
      } catch (error) {
        console.error('Error creating user:', error)
        throw new LicencaError(
          'Falha ao criar utilizador admin',
          undefined,
          error
        )
      }
    })
  }

  public async getBasicUserById(
    id: string
  ): Promise<ResponseApi<GSResponse<UtilizadorDTO>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.getRequest<
          GSResponse<UtilizadorDTO>
        >(`/api/identity/users/${id}/get`)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaError(
          'Falha ao obter utilizador básico por ID',
          undefined,
          error
        )
      }
    })
  }

  public async updateUser(
    id: string,
    data: UpdateUtilizadorDTO
  ): Promise<ResponseApi<GSResponse<UtilizadorDTO>>> {
    return this.withRetry(async () => {
      console.log('data:', data)
      try {
        const response = await this.httpClient.putRequest<
          UpdateUtilizadorDTO,
          GSResponse<UtilizadorDTO>
        >(`/api/identity/users/${id}/update`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaError(
          'Falha ao atualizar utilizador admin',
          undefined,
          error
        )
      }
    })
  }

  public async deleteUser(id: string): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          `/api/identity/users/${id}/delete`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaError(
          'Falha ao apagar utilizador admin',
          undefined,
          error
        )
      }
    })
  }

  public async getUtilizadoresPaginated(
    clienteId: string,
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<UtilizadorDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      `/api/identity/clientes/${clienteId}/users/users-paginated`,
      params
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<UtilizadorDTO>
          >(`/api/identity/clientes/${clienteId}/users/users-paginated`, params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new LicencaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new LicencaError(
            'Falha ao obter utilizadores admin paginados',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getUtilizadoresRoleClientLicenca(
    licencaId: string
  ): Promise<ResponseApi<GSResponse<LicencaUtilizadorDTO[]>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.getRequest<
          GSResponse<LicencaUtilizadorDTO[]>
        >(`/api/licencas/${licencaId}/utilizadores?role=client`)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaError(
          'Falha ao obter utilizadores da licença',
          undefined,
          error
        )
      }
    })
  }

  public async updateUtilizadoresLicenca(
    licencaId: string,
    data: { utilizadorId: string; ativo: boolean }[]
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          { utilizadorId: string; ativo: boolean }[],
          GSResponse<string>
        >(`/api/licencas/${licencaId}/utilizadores`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaError(
          'Falha ao atualizar utilizadores da licença',
          undefined,
          error
        )
      }
    })
  }
}
