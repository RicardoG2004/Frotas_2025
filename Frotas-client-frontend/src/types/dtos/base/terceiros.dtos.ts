import { CodigoPostalDTO } from './codigospostais.dtos'

export interface CreateTerceiroDTO {
  Nome: string
  NIF: string
  Morada: string
  CodigoPostalId: string
}

export interface UpdateTerceiroDTO extends Omit<CreateTerceiroDTO, 'id'> {
  id?: string
}

export interface TerceiroDTO {
  id: string
  nome: string
  nif: string
  morada: string
  codigoPostalId: string
  codigoPostal: CodigoPostalDTO
  createdOn: Date
}


