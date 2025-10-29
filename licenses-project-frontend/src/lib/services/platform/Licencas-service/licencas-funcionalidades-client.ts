import { GSResponse } from '@/types/api/responses'
import { ModuloFuncionalidadeDTO } from '@/types/dtos'
import {
  ResponseApi,
  ResponseModuloFuncionalidadeLicenca,
} from '@/types/responses'
import { BaseApiClient } from '@/lib/base-client'
import { LicencaError } from './licenca-error'

export class LicencasFuncionalidadesClient extends BaseApiClient {
  constructor(idFuncionalidade: string) {
    super(idFuncionalidade)
  }

  // Copy methods from original file lines 34-121

  public async updateLicencaModulosFuncionalidades(
    licencaId: string,
    data: ModuloFuncionalidadeDTO[]
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          ModuloFuncionalidadeDTO[],
          GSResponse<string>
        >(`/api/licencas/${licencaId}/modulos/funcionalidades`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new LicencaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new LicencaError(
          'Falha ao atualizar funcionalidades da licença',
          undefined,
          error
        )
      }
    })
  }

  public async getModulosFuncionalidadesLicenca(
    licencaId: string
  ): Promise<ResponseApi<GSResponse<ResponseModuloFuncionalidadeLicenca>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/api/licencas/${licencaId}/modulos/funcionalidades`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ResponseModuloFuncionalidadeLicenca>
          >(`/api/licencas/${licencaId}/modulos/funcionalidades`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new LicencaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new LicencaError(
            'Falha ao obter módulos e funcionalidades da licença',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getModulosFuncionalidadesLicencaByApiKey(): Promise<
    ResponseApi<GSResponse<ResponseModuloFuncionalidadeLicenca>>
  > {
    const cacheKey = this.getCacheKey(
      'GET',
      '/api/licencas/by-api-key/modulos/funcionalidades'
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ResponseModuloFuncionalidadeLicenca>
          >('/api/licencas/by-api-key/modulos/funcionalidades')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new LicencaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new LicencaError(
            'Falha ao obter módulos e funcionalidades da licença por API key',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getModulosFuncionalidadesLicencaById(
    licencaId: string
  ): Promise<ResponseApi<GSResponse<ResponseModuloFuncionalidadeLicenca>>> {
    const cacheKey = this.getCacheKey(
      'GET',
      `/api/licencas/${licencaId}/modulos/funcionalidades`
    )
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<ResponseModuloFuncionalidadeLicenca>
          >(`/api/licencas/${licencaId}/modulos/funcionalidades`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new LicencaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new LicencaError(
            'Falha ao obter módulos e funcionalidades da licença',
            undefined,
            error
          )
        }
      })
    )
  }
}
