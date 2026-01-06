import { GSResponse } from '@/types/api/responses'
import { VersionDTO } from '@/types/dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient } from '@/lib/base-client'
import { VersionError } from './version-error'

export class VersionClient extends BaseApiClient {
  constructor(idFuncionalidade?: string) {
    super(idFuncionalidade || '')
  }

  public async getVersion(
    requireAuth = false
  ): Promise<ResponseApi<GSResponse<VersionDTO>>> {
    const cacheKey = this.getCacheKey('GET', '/api/version')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = requireAuth
            ? await this.httpClient.getRequest<GSResponse<VersionDTO>>(
                '/api/version'
              )
            : await this.httpClient.getRequestWithoutAuth<
                GSResponse<VersionDTO>
              >('/api/version')

          if (!response.info) {
            throw new VersionError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new VersionError('Falha ao obter versão', undefined, error)
        }
      })
    )
  }
}
