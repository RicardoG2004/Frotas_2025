export interface CreateLicencaDTO {
  nome: string
  dataInicio?: Date
  dataFim?: Date
  numeroUtilizadores: number
  aplicacaoId: string
  clienteId: string
  useOwnUpdater?: boolean
  frontendPath?: string
  apiPath?: string
  apiPoolName?: string
  frontendPoolName?: string
  url1?: string
  url2?: string
  url3?: string
  url4?: string
  url5?: string
  url6?: string
  url7?: string
  url8?: string
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
  versaoInstalada?: string
  useOwnUpdater?: boolean
  frontendPath?: string
  apiPath?: string
  apiPoolName?: string
  frontendPoolName?: string
  url1?: string
  url2?: string
  url3?: string
  url4?: string
  url5?: string
  url6?: string
  url7?: string
  url8?: string
  aplicacao?: {
    nome: string
    versao?: string
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
