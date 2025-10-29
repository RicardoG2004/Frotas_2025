import { EntidadeDTO } from '../base/entidades.dtos'
import { CemiterioDTO } from './cemiterios.dtos'

export interface CreateProprietarioDTO {
  cemiterioId: string
  entidadeId: string
  sepulturas?: CreateProprietarioSepulturaRequestDTO[]
}

export interface CreateProprietarioSepulturaRequestDTO {
  sepulturaId: string
  data: Date
  ativo: boolean
  isProprietario: boolean
  isResponsavel: boolean
  isResponsavelGuiaReceita: boolean
  dataInativacao?: Date
  fracao?: string
  observacoes?: string
  historico: boolean
}

export interface UpdateProprietarioDTO extends CreateProprietarioDTO {
  id: string
}

export interface ProprietarioDTO {
  id: string
  cemiterioId: string
  cemiterio?: CemiterioDTO
  entidadeId: string
  entidade?: EntidadeDTO
  createdOn: Date
  sepulturas?: ProprietarioSepulturaDTO[]
}

export interface CreateProprietarioSepulturaDTO {
  proprietarioId: string
  sepulturaId: string
  data: Date
  ativo: boolean
  isProprietario: boolean
  isResponsavel: boolean
  isResponsavelGuiaReceita: boolean
  dataInativacao?: Date
  fracao?: string
  observacoes?: string
  historico: boolean
}

// DTO for creating proprietario relationships from sepultura form
export interface CreateProprietarioSepulturaFromSepulturaDTO {
  proprietarioId: string
  data: Date
  ativo: boolean
  isProprietario: boolean
  isResponsavel: boolean
  isResponsavelGuiaReceita: boolean
  dataInativacao?: Date
  fracao?: string
  observacoes?: string
  historico: boolean
}

export interface UpdateProprietarioSepulturaDTO
  extends CreateProprietarioSepulturaDTO {
  id: string
}

export interface ProprietarioSepulturaDTO {
  id: string
  proprietarioId: string
  proprietario?: ProprietarioDTO
  sepulturaId: string
  sepultura?: any // Using any to avoid circular dependency with SepulturaDTO
  data: Date
  ativo: boolean
  isProprietario: boolean
  isResponsavel: boolean
  isResponsavelGuiaReceita: boolean
  dataInativacao?: Date
  fracao?: string
  observacoes?: string
  historico: boolean
  createdOn: Date
}
