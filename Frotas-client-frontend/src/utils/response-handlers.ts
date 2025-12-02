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

  // Normalize status value to handle both enum/numeric values and string values (camelCase from backend)
  const normalizeStatus = (statusValue: any): 'success' | 'partialSuccess' | 'failure' | null => {
    if (statusValue === null || statusValue === undefined) {
      return null
    }

    // Handle numeric enum values (0, 1, 2)
    if (typeof statusValue === 'number') {
      if (statusValue === ResponseStatus.Success || statusValue === 0) return 'success'
      if (statusValue === ResponseStatus.PartialSuccess || statusValue === 1) return 'partialSuccess'
      if (statusValue === ResponseStatus.Failure || statusValue === 2) return 'failure'
    }

    // Handle enum values directly
    if (statusValue === ResponseStatus.Success) return 'success'
    if (statusValue === ResponseStatus.PartialSuccess) return 'partialSuccess'
    if (statusValue === ResponseStatus.Failure) return 'failure'

    // Handle string values (camelCase from backend JSON serialization)
    if (typeof statusValue === 'string') {
      const normalized = statusValue.toLowerCase().trim()
      if (normalized === 'success' || normalized === '0') return 'success'
      if (normalized === 'partialsuccess' || normalized === 'partial-success' || normalized === '1') return 'partialSuccess'
      if (normalized === 'failure' || normalized === '2') return 'failure'
    }

    return null
  }

  const normalizedStatus = normalizeStatus(status)

  // Handle response based on normalized status
  switch (normalizedStatus) {
    case 'success':
      toast.success(successMessage)
      return { success: true, data: data as T }

    case 'partialSuccess':
      const partialMessage = getPartialSuccessMessage(
        response as ResponseApi<ApiResponseInfo>,
        partialSuccessMessage
      )
      toast.partialSuccess(partialMessage)
      return { success: true, data: data as T, isPartialSuccess: true }

    case 'failure':
      const errorMsg = getErrorMessage(
        response as ResponseApi<ApiResponseInfo>,
        errorMessage
      )
      toast.error(errorMsg)
      return { success: false }

    default:
      // Log for debugging when status cannot be normalized
      console.warn('Status de resposta desconhecido:', {
        status,
        normalizedStatus,
        responseInfo: response.info,
        fullResponse: response,
      })
      // Try to determine success from HTTP status code as fallback
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
