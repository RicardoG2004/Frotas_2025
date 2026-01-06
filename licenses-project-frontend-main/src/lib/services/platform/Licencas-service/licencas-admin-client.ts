import { GSResponse } from '@/types/api/responses'
import { LicencaAPIKeyDTO } from '@/types/dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient } from '@/lib/base-client'
import { LicencaError } from './licenca-error'

export class LicencasAdminClient extends BaseApiClient {
  constructor(idFuncionalidade: string) {
    super(idFuncionalidade)
  }

  public async getLicencaApiKey(
    licencaId: string
  ): Promise<ResponseApi<GSResponse<LicencaAPIKeyDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/api/keys/${licencaId}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<LicencaAPIKeyDTO>
          >(`/api/keys/${licencaId}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new LicencaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new LicencaError('Falha ao obter API key', undefined, error)
        }
      })
    )
  }
}
