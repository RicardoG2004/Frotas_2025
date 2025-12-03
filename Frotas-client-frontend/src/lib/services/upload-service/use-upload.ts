import { useMutation } from '@tanstack/react-query'
import state from '@/states/state'
import { UploadClient } from './upload-client'
import type { UploadedFileInfo } from './upload-client'

const uploadClient = new UploadClient('upload')

export const useUploadFiles = () => {
  return useMutation({
    mutationFn: async (files: File[]) => {
      console.log('[useUploadFiles] Iniciando upload de', files.length, 'ficheiros')
      try {
        const response = await uploadClient.uploadFiles(files)
        console.log('[useUploadFiles] Resposta do servidor:', response)
        if (!response.success) {
          throw new Error(response.message || 'Erro ao fazer upload dos ficheiros')
        }
        console.log('[useUploadFiles] ✅ Upload bem-sucedido:', response.files)
        return response.files
      } catch (error) {
        console.error('[useUploadFiles] ❌ Erro no upload:', error)
        throw error
      }
    },
  })
}

export const useDeleteFile = () => {
  return useMutation({
    mutationFn: async (caminho: string) => {
      const response = await uploadClient.deleteFile(caminho)
      if (!response.success) {
        throw new Error(response.message || 'Erro ao eliminar o ficheiro')
      }
      return response
    },
  })
}

export const getFileUrl = (caminho: string): string => {
  return uploadClient.getFileUrl(caminho)
}

export type { UploadedFileInfo }

