import { ResponseUser } from '../responses'

export interface CreatePerfilDTO {
  nome: string
  ativo: boolean
  clienteId?: string
  licencaId?: string
}

export interface UpdatePerfilDTO extends CreatePerfilDTO {
  id?: string
}

export interface PerfilDTO {
  id?: string
  nome: string
  ativo: boolean
  clienteId?: string
  licencaId?: string
  cliente?: {
    id: string
    nome: string
  }
}

export interface PerfilFuncionalidadeDTO {
  perfilId?: string
  funcionalidadeNome?: string
  funcionalidadeId?: string
  authVer: boolean
  authAdd: boolean
  authChg: boolean
  authDel: boolean
  authPrt: boolean
}

export interface PerfilModuloDTO {
  moduloId: string
  moduloNome: string
  funcionalidades: PerfilFuncionalidadeDTO[]
  estado: number
}

export interface PerfilWithUtilizadoresDTO extends PerfilDTO {
  utilizadores: ResponseUser[]
}

export interface LicencaPerfilUtilizadoresDTO {
  perfis: PerfilWithUtilizadoresDTO[]
}
