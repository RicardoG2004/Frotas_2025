import { GSResponse } from '@/types/api/responses'
import { PerfilDTO } from '@/types/dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient } from '@/lib/base-client'
import { PerfilError } from './perfil-error'
import { PerfilAdminClient } from './perfis-admin-client'

export class PerfisClient extends BaseApiClient {
  public Admin: PerfilAdminClient

  constructor(idFuncionalidade: string) {
    super(idFuncionalidade)
    this.Admin = new PerfilAdminClient(idFuncionalidade)
  }

  public async getPerfis(): Promise<ResponseApi<GSResponse<PerfilDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/api/perfis')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<PerfilDTO[]>>(
              '/api/perfis'
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

  public async getPerfilById(
    id: string
  ): Promise<ResponseApi<GSResponse<PerfilDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/api/perfis/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<PerfilDTO>
          >(`/api/perfis/${id}`)

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
}
