import { BaseApiError } from '@/lib/base-client'

export class ProprietarioError extends BaseApiError {
  constructor(message: string, statusCode?: number, data?: unknown) {
    super(message, statusCode, data)
    this.name = 'ProprietarioError'
  }
}
