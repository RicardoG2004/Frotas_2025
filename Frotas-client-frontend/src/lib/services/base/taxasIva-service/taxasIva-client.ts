import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedRequest,
} from '@/types/api/responses'
import { PaginatedResponse } from '@/types/api/responses'
import {
  CreateTaxaIvaDTO,
  TaxaIvaDTO,
  UpdateTaxaIvaDTO,
} from '@/types/dtos/base/taxasIva.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient } from '@/lib/base-client'
import { TaxaIvaError } from './taxasIva-errors'

export class TaxasIvaClient extends BaseApiClient {
  public async getTaxasIvaPaginated(
    params: PaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<TaxaIvaDTO>>> {
    const cacheKey = this.getCacheKey('POST', '/api/taxas-iva/paginated', params)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            PaginatedRequest,
            PaginatedResponse<TaxaIvaDTO>
          >(state.URL, '/client/base/taxas-iva/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new TaxaIvaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          console.error('Falha ao obter taxas de IVA paginadas:', error)
          throw new TaxaIvaError(
            'Falha ao obter taxas de IVA paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getTaxasIva(): Promise<ResponseApi<GSResponse<TaxaIvaDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/base/taxas-iva')
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<TaxaIvaDTO[]>
          >(state.URL, '/client/base/taxas-iva')

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new TaxaIvaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new TaxaIvaError('Falha ao obter taxas de IVA', undefined, error)
        }
      })
    )
  }

  public async getTaxaIva(id: string): Promise<ResponseApi<GSResponse<TaxaIvaDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/base/taxas-iva/${id}`)
    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.getRequest<
            GSResponse<TaxaIvaDTO>
          >(state.URL, `/client/base/taxas-iva/${id}`)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new TaxaIvaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new TaxaIvaError('Falha ao obter taxa de IVA', undefined, error)
        }
      })
    )
  }

  public async createTaxaIva(
    data: CreateTaxaIvaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.postRequest<
          CreateTaxaIvaDTO,
          GSResponse<string>
        >(state.URL, '/client/base/taxas-iva', data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TaxaIvaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TaxaIvaError('Falha ao criar taxa de IVA', undefined, error)
      }
    })
  }

  public async updateTaxaIva(
    id: string,
    data: UpdateTaxaIvaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateTaxaIvaDTO,
          GSResponse<string>
        >(state.URL, `/client/base/taxas-iva/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TaxaIvaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TaxaIvaError('Falha ao atualizar taxa de IVA', undefined, error)
      }
    })
  }

  public async deleteTaxaIva(id: string): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequest<GSGenericResponse>(
          state.URL,
          `/client/base/taxas-iva/${id}`
        )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TaxaIvaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TaxaIvaError('Falha ao apagar taxa de IVA', undefined, error)
      }
    })
  }

  public async deleteMultipleTaxasIva(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.deleteRequestWithBody<
          { ids: string[] },
          GSGenericResponse
        >(state.URL, '/client/base/taxas-iva/bulk', { ids: ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new TaxaIvaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new TaxaIvaError(
          'Falha ao apagar múltiplas taxas de IVA',
          undefined,
          error
        )
      }
    })
  }
}

