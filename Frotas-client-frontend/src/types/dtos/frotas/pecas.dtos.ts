import { TaxaIvaDTO } from '../base/taxasIva.dtos'

export interface PecaDTO {
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

export interface CreatePecaDTO {
  designacao: string
  anos: number
  kms: number
  tipo: string
  taxaIvaId?: string
  custo: number
}

export interface UpdatePecaDTO {
  designacao: string
  anos: number
  kms: number
  tipo: string
  taxaIvaId?: string
  custo: number
}