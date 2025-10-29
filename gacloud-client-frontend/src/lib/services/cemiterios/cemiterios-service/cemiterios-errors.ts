import { BaseApiError } from '@/lib/base-client'

export class CemiterioError extends BaseApiError {
  name: string = 'CemiterioError'
}
