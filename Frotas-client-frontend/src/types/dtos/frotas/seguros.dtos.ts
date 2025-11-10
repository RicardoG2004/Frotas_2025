import { SeguradoraDTO } from '@/types/dtos/frotas/seguradoras.dtos'

export interface CreateSeguroDTO {
  designacao: string
  apolice: string
  seguradoraId: string
  assistenciaViagem: boolean
  cartaVerde: boolean
  valorCobertura: number
  custoAnual: number
  riscosCobertos: string
  dataInicial: string
  dataFinal: string
}

export interface UpdateSeguroDTO extends Omit<CreateSeguroDTO, 'seguradoraId'> {
  seguradoraId: string
  id?: string
}

export interface SeguroDTO {
  id: string
  designacao: string
  apolice: string
  seguradoraId: string
  seguradora?: SeguradoraDTO
  assistenciaViagem: boolean
  cartaVerde: boolean
  valorCobertura: number
  custoAnual: number
  riscosCobertos: string
  dataInicial: string
  dataFinal: string
  createdOn?: string
}


