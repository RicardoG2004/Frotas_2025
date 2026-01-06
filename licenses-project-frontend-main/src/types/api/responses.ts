export interface GSGenericResponse {
  data: string
  messages: string[]
  succeeded: boolean
}

export interface GSResponseToken {
  aud: string
  email: string
  exp: number
  iss: string
  jti: string
  name: string
  roles: string
  sub: string
  uid: string
}

export interface GSResponse<T> {
  data: T
  messages: string[]
  succeeded: boolean
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
