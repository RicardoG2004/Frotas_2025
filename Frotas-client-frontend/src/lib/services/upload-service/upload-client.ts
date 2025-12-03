import { BaseApiClient } from '@/lib/base-client'
import state from '@/states/state'

export interface UploadedFileInfo {
  nome: string
  caminho: string
  tipo: string
  tamanho: number
}

export interface UploadResponse {
  success: boolean
  files: UploadedFileInfo[]
  message?: string
}

export interface DeleteResponse {
  success: boolean
  message: string
}

export class UploadClient extends BaseApiClient {
  constructor(idFuncionalidade: string) {
    super(idFuncionalidade)
  }

  /**
   * Faz upload de múltiplos ficheiros para o servidor
   * @param files Array de ficheiros para fazer upload
   * @returns Informações dos ficheiros carregados
   */
  async uploadFiles(files: File[]): Promise<UploadResponse> {
    const formData = new FormData()
    
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await this.httpClient.postRequest<FormData, UploadResponse>(
      state.URL,
      '/client/upload',
      formData
    )

    return response.info
  }

  /**
   * Elimina um ficheiro do servidor
   * @param caminho Caminho do ficheiro a eliminar
   * @returns Resposta da operação
   */
  async deleteFile(caminho: string): Promise<DeleteResponse> {
    const url = `/client/upload?caminho=${encodeURIComponent(caminho)}`
    const response = await this.httpClient.deleteRequest<DeleteResponse>(
      state.URL,
      url
    )

    return response.info
  }

  /**
   * Constrói a URL completa para aceder a um ficheiro
   * @param caminho Caminho relativo do ficheiro
   * @returns URL completa do ficheiro
   */
  getFileUrl(caminho: string): string {
    // Remove barras iniciais do caminho
    const normalizedPath = caminho.replace(/^\/+/, '')
    // Usar a base URL do state
    const baseUrl = state.URL.replace(/\/$/, '')
    return `${baseUrl}/${normalizedPath}`
  }
}

