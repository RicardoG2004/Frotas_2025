import { CodigoPostalDTO } from '../base/codigospostais.dtos'

export interface CreateCemiterioDTO {
  nome: string
  morada: string
  codigoPostalId: string
  predefinido: boolean
}

export interface UpdateCemiterioDTO extends Omit<CreateCemiterioDTO, 'id'> {
  id?: string
}

export interface CemiterioDTO {
  id: string
  nome: string
  morada: string
  codigoPostalId: string
  codigoPostal: CodigoPostalDTO
  predefinido: boolean
  createdOn: Date
}
