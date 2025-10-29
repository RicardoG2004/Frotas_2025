import { GSResponse } from '@/types/api/responses'
import { ResponseApi } from '@/types/responses'
import { CemiteriosService } from '@/lib/services/cemiterios/cemiterios-service'

export const cemiteriosViewQueries = {
  getCemiterioSvg: async (
    id: string
  ): Promise<ResponseApi<GSResponse<string>>> => {
    return CemiteriosService('cemiterios').getCemiterioSvg(id)
  },
}
