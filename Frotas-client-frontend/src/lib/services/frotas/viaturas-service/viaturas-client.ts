import state from '@/states/state'
import {
  GSGenericResponse,
  GSResponse,
  PaginatedResponse,
} from '@/types/api/responses'
import {
  CreateViaturaDTO,
  ViaturaDTO,
  UpdateViaturaDTO,
} from '@/types/dtos/frotas/viaturas.dtos'
import { ResponseApi } from '@/types/responses'
import { BaseApiClient, BaseApiError } from '@/lib/base-client'
import { ViaturaError } from './viaturas-errors'

type ViaturaPaginatedRequest = {
  pageNumber: number
  pageSize: number
  filters: Array<{ id: string; value: string }>
  sorting?: Array<{ id: string; desc: boolean }>
}

export class ViaturasClient extends BaseApiClient {
  constructor(idFuncionalidade: string) {
    super(idFuncionalidade)
  }

  public async getViaturasPaginated(
    params: ViaturaPaginatedRequest
  ): Promise<ResponseApi<PaginatedResponse<ViaturaDTO>>> {
    const cacheKey = this.getCacheKey(
      'POST',
      '/client/frotas/viaturas/paginated',
      params
    )

    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response = await this.httpClient.postRequest<
            ViaturaPaginatedRequest,
            PaginatedResponse<ViaturaDTO>
          >(state.URL, '/client/frotas/viaturas/paginated', params)

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ViaturaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ViaturaError(
            'Falha ao obter viaturas paginadas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getViaturas(): Promise<ResponseApi<GSResponse<ViaturaDTO[]>>> {
    const cacheKey = this.getCacheKey('GET', '/client/frotas/viaturas')

    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<ViaturaDTO[]>>(
              state.URL,
              '/client/frotas/viaturas'
            )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ViaturaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ViaturaError(
            'Falha ao obter viaturas',
            undefined,
            error
          )
        }
      })
    )
  }

  public async getViatura(
    id: string
  ): Promise<ResponseApi<GSResponse<ViaturaDTO>>> {
    const cacheKey = this.getCacheKey('GET', `/client/frotas/viaturas/${id}`)

    return this.withCache(cacheKey, () =>
      this.withRetry(async () => {
        try {
          const response =
            await this.httpClient.getRequest<GSResponse<ViaturaDTO>>(
              state.URL,
              `/client/frotas/viaturas/${id}`
            )

          if (!response.info) {
            console.error('Formato de resposta inválido:', response)
            throw new ViaturaError('Formato de resposta inválido')
          }

          return response
        } catch (error) {
          throw new ViaturaError(
            'Falha ao obter viatura',
            undefined,
            error
          )
        }
      })
    )
  }

  public async createViatura(
    data: CreateViaturaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        console.log('[CreateViatura Client] Enviando payload:', {
          matricula: data.matricula,
          marcaId: data.marcaId,
          modeloId: data.modeloId,
        })
        
        const response = await this.httpClient.postRequest<
          CreateViaturaDTO,
          GSResponse<string>
        >(state.URL, '/client/frotas/viaturas', data)

        console.log('[CreateViatura Client] Resposta recebida:', response)

        if (!response.info) {
          console.error('[CreateViatura Client] Formato de resposta inválido:', response)
          throw new ViaturaError('Formato de resposta inválido')
        }

        // Verificar se a resposta indica falha (status pode ser enum, número ou string)
        const status = response.info.status
        const isFailure = status === 2 || 
                         status === 'failure' || 
                         status === 'Failure' ||
                         (typeof status === 'string' && status.toLowerCase() === 'failure')
        
        if (isFailure) {
          console.error('[CreateViatura Client] Resposta indica falha:', response.info)
          const errorMessage = response.info.messages 
            ? Object.values(response.info.messages).flat().join('; ')
            : 'Falha ao criar viatura'
          throw new ViaturaError(errorMessage, undefined, response.info)
        }

        return response
      } catch (error) {
        console.error('[CreateViatura Client] Erro capturado:', error)
        
        // Extrair mensagem detalhada do erro do backend
        let errorMessage = 'Falha ao criar viatura'
        let originalErrorData: unknown = undefined

        if (error && typeof error === 'object') {
          // Se for BaseApiError com dados do backend
          if ('response' in error && error.response && typeof error.response === 'object') {
            const axiosError = error as any
            if (axiosError.response?.data) {
              const backendData = axiosError.response.data
              originalErrorData = backendData
              console.error('[CreateViatura Client] Erro do backend:', backendData)

              // Tentar extrair mensagens do backend
              if (backendData.messages && typeof backendData.messages === 'object') {
                const messages: Record<string, string[]> = backendData.messages
                const allMessages = Object.entries(messages)
                  .flatMap(([key, values]) => values.map(v => `${key}: ${v}`))
                if (allMessages.length > 0) {
                  errorMessage = allMessages.join('; ')
                }
              } else if (backendData.message) {
                errorMessage = backendData.message
              } else if (typeof backendData === 'string') {
                errorMessage = backendData
              }
            }
          } else if ('data' in error) {
            // Caso o erro já seja um BaseApiError com a propriedade 'data'
            const baseApiError = error as any
            originalErrorData = baseApiError.data
            if (baseApiError.data && typeof baseApiError.data === 'object' && 'messages' in baseApiError.data) {
              const messages: Record<string, string[]> = baseApiError.data.messages
              const allMessages = Object.entries(messages)
                .flatMap(([key, values]) => values.map(v => `${key}: ${v}`))
              if (allMessages.length > 0) {
                errorMessage = allMessages.join('; ')
              }
            } else if (baseApiError.message) {
              errorMessage = baseApiError.message
            }
          }
        }

        // Preservar o erro original para debug
        console.error('[CreateViatura Client] Erro final a lançar:', errorMessage)
        throw new ViaturaError(
          errorMessage,
          undefined,
          originalErrorData
        )
      }
    })
  }

  public async updateViatura(
    id: string,
    data: UpdateViaturaDTO
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const response = await this.httpClient.putRequest<
          UpdateViaturaDTO,
          GSResponse<string>
        >(state.URL, `/client/frotas/viaturas/${id}`, data)

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ViaturaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        // Log completo do erro para debug
        console.error('[UpdateViatura Client] Erro capturado:', error)
        
        // Extrair mensagem detalhada do erro do backend
        let errorMessage = 'Falha ao atualizar viatura'
        let errorData: any = null
        
        // Verificar se é BaseApiError
        if (error && typeof error === 'object' && 'name' in error && error.name === 'BaseApiError') {
          const baseError = error as any
          errorData = baseError.data
          
          if (errorData) {
            console.error('[UpdateViatura Client] Dados do backend:', errorData)
            
            // Tentar extrair mensagens do backend
            if (errorData.messages && typeof errorData.messages === 'object') {
              const messages: Record<string, string[]> = errorData.messages
              const allMessages = Object.entries(messages)
                .flatMap(([key, values]) => values.map(v => `${key}: ${v}`))
              if (allMessages.length > 0) {
                errorMessage = allMessages.join('; ')
              }
            } else if (errorData.message) {
              errorMessage = errorData.message
            }
          }
        }
        
        // Se ainda não temos uma mensagem detalhada, usar a mensagem do erro
        if (errorMessage === 'Falha ao atualizar viatura' && error instanceof Error) {
          errorMessage = error.message || errorMessage
        }
        
        console.error('[UpdateViatura Client] Mensagem final:', errorMessage)
        throw new ViaturaError(errorMessage, undefined, error)
      }
    })
  }

  public async deleteViatura(
    id: string
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response =
          await this.httpClient.deleteRequest<GSGenericResponse>(
            state.URL,
            `/client/frotas/viaturas/${id}`
          )

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ViaturaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ViaturaError(
          'Falha ao remover viatura',
          undefined,
          error
        )
      }
    })
  }

  public async deleteMultipleViaturas(
    ids: string[]
  ): Promise<ResponseApi<GSGenericResponse>> {
    return this.withRetry(async () => {
      try {
        const response =
          await this.httpClient.deleteRequestWithBody<
            { ids: string[] },
            GSGenericResponse
          >(state.URL, '/client/frotas/viaturas/bulk', { ids })

        if (!response.info) {
          console.error('Formato de resposta inválido:', response)
          throw new ViaturaError('Formato de resposta inválido')
        }

        return response
      } catch (error) {
        throw new ViaturaError(
          'Falha ao remover viaturas',
          undefined,
          error
        )
      }
    })
  }

  public async uploadDocumento(
    file: File,
    viaturaId?: string,
    pasta?: string | null
  ): Promise<ResponseApi<GSResponse<string>>> {
    return this.withRetry(async () => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        if (viaturaId) {
          formData.append('viaturaId', viaturaId)
        }
        if (pasta) {
          formData.append('pasta', pasta)
        }

        const response = await this.httpClient.uploadFile<GSResponse<string>>(
          state.URL,
          '/client/frotas/documentos/upload',
          formData
        )

        return response
      } catch (error) {
        throw new ViaturaError('Falha ao fazer upload do documento', undefined, error)
      }
    })
  }
}

