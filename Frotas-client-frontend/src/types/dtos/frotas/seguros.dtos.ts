import { SeguradoraDTO } from '@/types/dtos/frotas/seguradoras.dtos'

export enum PeriodicidadeSeguro {
  Mensal = 0,
  Trimestral = 1,
  Anual = 2,
}

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
  periodicidade: PeriodicidadeSeguro
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
  periodicidade: PeriodicidadeSeguro
  createdOn?: string
}


