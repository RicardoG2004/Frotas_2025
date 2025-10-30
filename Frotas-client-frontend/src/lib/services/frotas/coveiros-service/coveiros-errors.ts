import { BaseApiError } from '@/lib/base-client'

export class CoveiroError extends BaseApiError {
  name: string = 'CoveiroError'
}
