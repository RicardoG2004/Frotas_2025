import { BaseApiError } from '@/lib/base-client'

export class ReservaOficinaError extends BaseApiError {
  constructor(
    message: string,
    statusCode?: number,
    originalError?: unknown
  ) {
    super(message, statusCode, originalError)
    this.name = 'ReservaOficinaError'
  }
}

