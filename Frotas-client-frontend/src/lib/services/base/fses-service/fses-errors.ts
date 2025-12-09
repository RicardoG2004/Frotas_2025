import { BaseApiError } from '@/lib/base-client'

export class FseError extends BaseApiError {
  name: string = 'FseError'
}

