import { GSGenericResponse } from '@/types/api/responses'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient } from '@/lib/base-client'
import { UtilizadorError } from './utilizador-error'

interface DeleteUsersRequest {
  ids: string[]
}

export class UtilizadoresAdminClient extends BaseApiClient {
  constructor(idFuncionalidade: string) {
    super(idFuncionalidade)
  }

  public async deleteMultipleUsers(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          DeleteUsersRequest,
          GSGenericResponse
        >('/api/identity/users/bulk-delete', { ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new UtilizadorError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new UtilizadorError(
          'Falha ao apagar múltiplos utilizadores',
          undefined,
          error
        )
      }
    })
  }
}
