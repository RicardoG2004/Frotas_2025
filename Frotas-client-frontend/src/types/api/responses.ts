export interface GSGenericResponse {
  data: string
  messages: Record<string, string[]>
  status: ResponseStatus
}

export interface GSResponseToken {
  sub: string
  email: string
  firstName: string
  lastName: string
  client_api_key: string
  license_id: string
  client_id: string
  roles: string
  exp: number
  iss: string
  aud: string
}

export enum ResponseStatus {
  Success = 0,
  PartialSuccess = 1,
  Failure = 2,
}

export interface GSResponse<T> {
  data: T
  messages: Record<string, string[]>
  status: ResponseStatus
}

export interface PaginatedRequest {
  pageNumber: number
  pageSize: number
  filters?: Record<string, string>
  sorting?: Array<{ id: string; desc: boolean }>
}

export interface PaginatedResponse<T> {
  data: T[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

interface LicenseInfo {
  expirationDate: string
  isActive: boolean
  permissions: Record<string, number>
  modules: string[]
}

export interface LoginResponse {
  succeeded: boolean
  messages: Record<string, string>
  data: {
    token: string
    refreshToken: string
    expiryTime: string
    license: LicenseInfo
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
      imageUrl: string | null
      phoneNumber: string | null
      isActive: boolean
      clienteId: string
    }
  }
}
