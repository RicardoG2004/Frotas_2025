import { CodigoPostalDTO } from './codigospostais.dtos'
import { PaisDTO } from './paises.dtos'

export interface CreateEntidadeDTO {
  Designacao: string
  Morada: string
  Localidade: string
  CodigoPostalId: string
  PaisId: string
  Telefone: string
  Fax: string
  EnderecoHttp: string
  Email: string
}

export interface UpdateEntidadeDTO extends Omit<CreateEntidadeDTO, 'id'> {
  id?: string
}

export interface EntidadeDTO {
  id: string
  designacao: string
  morada: string
  localidade: string
  codigoPostalId: string
  codigoPostal: CodigoPostalDTO
  paisId: string
  pais: PaisDTO
  telefone: string
  fax: string
  enderecoHttp: string
  email: string
  createdOn: Date
}


