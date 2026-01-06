import { BaseApiError } from '@/lib/base-client'

export class AplicacaoError extends BaseApiError {
  name: string = 'AplicacaoError'
}
