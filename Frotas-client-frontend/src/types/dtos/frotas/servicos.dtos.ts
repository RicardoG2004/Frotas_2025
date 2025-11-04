import { TaxaIvaDTO } from '../base/taxasIva.dtos'

export interface ServicoDTO {
  id: string
  designacao?: string
  anos: number
  kms: number
  tipo?: string
  taxaIvaId?: string
  taxaIva?: TaxaIvaDTO
  custo: number
  custoTotal: number
  createdOn: Date
}

export interface CreateServicoDTO {
  designacao: string
  anos: number
  kms: number
  tipo: string
  taxaIvaId?: string
  custo: number
}

export interface UpdateServicoDTO {
  designacao: string
  anos: number
  kms: number
  tipo: string
  taxaIvaId?: string
  custo: number
}

