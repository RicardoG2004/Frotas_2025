export interface CreateLicencaDTO {
  nome: string
  dataInicio?: Date
  dataFim?: Date
  numeroUtilizadores: number
  aplicacaoId: string
  clienteId: string
}

export interface UpdateLicencaDTO extends CreateLicencaDTO {
  id?: string
  ativo: boolean
}

export interface LicencaDTO {
  id: string
  nome: string
  dataInicio?: Date
  dataFim?: Date
  numeroUtilizadores: number
  ativo?: boolean
  aplicacaoId: string
  bloqueada?: boolean
  dataBloqueio?: Date
  motivoBloqueio?: string
  aplicacao?: {
    nome: string
    area?: {
      nome: string
      color: string
    }
  }
  cliente?: {
    nome: string
  }
  clienteId: string
  licencasFuncionalidades?: LicencaFuncionalidadeDTO[]
  licencasModulos?: LicencaModuloDTO[]
  apiKey: string
}

export interface LicencaFuncionalidadeDTO {
  licencaId: string
  funcionalidadeId: string
}

export interface LicencaModuloDTO {
  licencaId: string
  moduloId: string
}

export interface LicencaAPIKeyDTO {
  apiKey: string
  ativo: boolean
}

export interface BloqueioLicencaDTO {
  motivoBloqueio: string
}

export interface ModuloFuncionalidadeDTO {
  moduloId: string
  funcionalidadeId: string
}
