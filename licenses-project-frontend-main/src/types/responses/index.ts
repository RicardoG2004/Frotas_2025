import {
  FuncionalidadeDTO,
  FuncionalidadePerfilDTO,
  ModuloPerfilDTO,
  PerfilModuloDTO,
} from '@/types/dtos'

export interface ResponseApi<T> {
  info: T
  status: number
  statusText: string
}

export interface ResponseAplicacao {
  ativo: boolean
  descricao: string
  id: string
  modulos: ResponseModulo[]
  nome: string
  createdOn: string
  versao: string
}

export interface ResponseCliente {
  id: string
  nome: string
  sigla: string
  dadosExternos?: boolean
  ativo?: boolean
  dadosUrl?: string
  nif?: string
}

export interface ResponseFuncionalidade {
  id: string
  nome: string
  createdOn: string
  moduloId: string
  descricao: string
  ativo?: boolean
}

export interface ResponseLicenca {
  id: string
  nome: string
  dataInicio?: Date
  dataFim?: Date
  numeroUtilizadores: number
  ativo?: boolean
  aplicacaoId: string
  clienteId: string
  nomeCliente?: string
  nomeAplicacao?: string
  aplicacao: {
    nome: string
  }
  cliente: {
    nome: string
  }
}

// Backend response structure for update info
export interface BackendUpdateInfo {
  hasUpdate: boolean
  updateId: string | null
  updateVersion: string | null
  updateType: number
  isMandatory: boolean
  updateDescription: string | null
  releaseNotes: string | null
  releaseDate: string | null
}

export interface ResponseLogin {
  token: string
  refreshToken: string
  refreshTokenExpiryTime: string
  data: {
    clienteId: string
    licencaId: string
  }
  update?: BackendUpdateInfo
}

export interface ResponseModulo {
  id: string
  nome: string
  createdOn: string
  aplicacaoId?: string
  descricao: string
  ativo?: boolean
  funcionalidades: FuncionalidadeDTO[]
}

export interface ResponseModuloFuncionalidadeLicenca {
  modulos: ModuloPerfilDTO[]
  funcionalidades: FuncionalidadePerfilDTO[]
}

export interface ResponsePerfil {
  id: string
  nome: string
  ativo: boolean
}

export interface ResponsePaginatedCliente {
  data: ResponseCliente[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface ResponseUser {
  id: string
  imageUrl: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  phoneNumber: string
  roleId: string
  clienteId: string
  perfisUtilizador?: string[]
}

export interface ResponsePerfilModulosFuncionalidades {
  modulos: PerfilModuloDTO[]
}
