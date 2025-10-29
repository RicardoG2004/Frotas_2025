import { GSResponse } from '@/types/api/responses'
import { UtilizadorDTO } from '@/types/dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient } from '@/lib/base-client'
import { LicencaError } from './licenca-error'
import { LicencasUtilizadoresAdminClient } from './licencas-utilizadores-admin-client'

export class LicencasUtilizadoresClient extends BaseApiClient {
  public Admin: LicencasUtilizadoresAdminClient

  constructor(idFuncionalidade: string) {
    super(idFuncionalidade)
    this.Admin = new LicencasUtilizadoresAdminClient(idFuncionalidade)
  }

  // Copy methods from original file lines 266-343
  public async getLicencaUtilizadores(
    licencaId: string
  ): Promise<ResponseApi<GSResponse<UtilizadorDTO[]>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.getRequest<
          GSResponse<UtilizadorDTO[]>
        >(`/api/licencas/${licencaId}/utilizadores`)

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

  public async addUtilizadorToLicenca(
    licencaId: string,
    data: UtilizadorDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          UtilizadorDTO,
          GSResponse<string>
        >(`/api/licencas/${licencaId}/utilizador`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaError(
          'Falha ao adicionar utilizador à licença',
          undefined,
          error
        )
      }
    })
  }

  public async updateUtilizadoresFromLicenca(
    licencaId: string,
    data: UtilizadorDTO[]
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UtilizadorDTO[],
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
