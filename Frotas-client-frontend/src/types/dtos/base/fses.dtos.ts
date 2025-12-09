import { CodigoPostalDTO } from './codigospostais.dtos'
import { PaisDTO } from './paises.dtos'

export interface CreateFseDTO {
  nome: string
  numContribuinte: string
  telefone: string
  morada?: string | null
  codigoPostalId?: string | null
  paisId?: string | null
  contacto?: string | null
  fax?: string | null
  email?: string | null
  enderecoHttp?: string | null
  origem?: string | null
}

export interface UpdateFseDTO extends Omit<CreateFseDTO, 'id'> {
  id?: string
}

export interface FseDTO {
  id: string
  nome: string
  numContribuinte: string
  telefone: string
  morada?: string | null
  codigoPostalId?: string | null
  codigoPostal?: CodigoPostalDTO | null
  paisId?: string | null
  pais?: PaisDTO | null
  contacto?: string | null
  fax?: string | null
  email?: string | null
  enderecoHttp?: string | null
  origem?: string | null
  createdOn: Date
}

