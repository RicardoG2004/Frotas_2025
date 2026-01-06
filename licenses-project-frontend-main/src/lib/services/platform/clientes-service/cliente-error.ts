import { BaseApiError } from '@/lib/base-client'

export class ClienteError extends BaseApiError {
  name: string = 'ClienteError'
}
