import { ResponseStatus, GSResponse } from '@/types/api/responses'
import { ResponseApi } from '@/types/responses'
import { getErrorMessage, getPartialSuccessMessage } from './error-handlers'
import { toast } from './toast-utils'

interface ApiResponseInfo {
  status: ResponseStatus
  messages: Record<string, string[]>
  data?: unknown
}

// Type guard to check if response.info is a GSResponse
function isGSResponse<T>(info: any): info is GSResponse<T> {
  return (
    info &&
    typeof info === 'object' &&
    ('status' in info || 'data' in info || 'messages' in info)
  )
}

/**
 * Handles API responses and shows appropriate toast messages
 * @param response - The API response
 * @param successMessage - Message to show on success
 * @param errorMessage - Message to show on error
 * @param partialSuccessMessage - Message to show on partial success
 * @returns Object with success status and data
 */
export const handleApiResponse = <T>(
  response: ResponseApi<ApiResponseInfo | GSResponse<T>>,
  successMessage: string = 'Operação realizada com sucesso',
  errorMessage: string = 'Erro ao realizar operação',
  partialSuccessMessage: string = 'Operação concluída com avisos'
): { success: boolean; data?: T; isPartialSuccess?: boolean } => {
  if (!response.info) {
    toast.error('Resposta inválida do servidor')
    return { success: false }
  }

  // Handle both ApiResponseInfo and GSResponse structures
  let status: ResponseStatus | number | undefined
  let data: T | unknown
  let messages: Record<string, string[]> = {}

  if (isGSResponse<T>(response.info)) {
    // GSResponse structure: { status, data, messages }
    status = response.info.status
    data = response.info.data
    messages = response.info.messages || {}
  } else {
    // ApiResponseInfo structure: { status, data?, messages }
    status = response.info.status
    data = (response.info as ApiResponseInfo).data
    messages = response.info.messages || {}
  }

  // Handle status that might be undefined or a number
  const statusValue = status !== undefined ? status : null

  // Handle new response structure with status field
  switch (statusValue) {
    case ResponseStatus.Success:
    case 0: // Handle numeric value
      toast.success(successMessage)
      return { success: true, data: data as T }

    case ResponseStatus.PartialSuccess:
    case 1: // Handle numeric value
      const partialMessage = getPartialSuccessMessage(
        response as ResponseApi<ApiResponseInfo>,
        partialSuccessMessage
      )
      toast.partialSuccess(partialMessage)
      return { success: true, data: data as T, isPartialSuccess: true }

    case ResponseStatus.Failure:
    case 2: // Handle numeric value
      const errorMsg = getErrorMessage(
        response as ResponseApi<ApiResponseInfo>,
        errorMessage
      )
      toast.error(errorMsg)
      return { success: false }

    default:
      // Log for debugging
      console.warn('Status de resposta desconhecido:', {
        status,
        statusValue,
        responseInfo: response.info,
        fullResponse: response,
      })
      // Try to determine success from HTTP status code
      if (response.status >= 200 && response.status < 300) {
        toast.success(successMessage)
        return { success: true, data: data as T }
      } else {
        const errorMsg = getErrorMessage(
          response as ResponseApi<ApiResponseInfo>,
          errorMessage
        )
        toast.error(errorMsg || 'Status de resposta desconhecido')
        return { success: false }
      }
  }
}

/**
 * Checks if a response is a partial success
 */
export const isPartialSuccess = (
  response: ResponseApi<ApiResponseInfo>
): boolean => {
  return response.info?.status === ResponseStatus.PartialSuccess
}

/**
 * Checks if a response is a full success
 */
export const isFullSuccess = (
  response: ResponseApi<ApiResponseInfo>
): boolean => {
  return response.info?.status === ResponseStatus.Success
}

/**
 * Checks if a response is a failure
 */
export const isFailure = (response: ResponseApi<ApiResponseInfo>): boolean => {
  return response.info?.status === ResponseStatus.Failure
}
