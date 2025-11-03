import { CodigoPostalDTO } from '../base/codigospostais.dtos'
import { PaisDTO } from '../base/paises.dtos'

export interface CreateFornecedorDTO {
  nome: string
  numContribuinte: string
  moradaEscritorio: string
  codigoPostalEscritorioId: string
  paisEscritorioId: string
  moradaCarga: string
  codigoPostalCargaId: string
  paisCargaId: string
  mesmoEndereco: boolean
  ativo: boolean
  origem: string
  contacto: string
  telefone: string
  telemovel: string
  fax: string
  email: string
  url: string
}

export interface UpdateFornecedorDTO extends Omit<CreateFornecedorDTO, 'id'> {
  id?: string
}

export interface FornecedorDTO {
  id: string
  nome: string
  numContribuinte: string
  moradaEscritorio: string
  codigoPostalEscritorioId: string
  codigoPostalEscritorio: CodigoPostalDTO
  paisEscritorioId: string
  paisEscritorio: PaisDTO
  moradaCarga: string
  codigoPostalCargaId: string
  codigoPostalCarga: CodigoPostalDTO
  paisCargaId: string
  paisCarga: PaisDTO
  mesmoEndereco: boolean
  ativo: boolean
  origem: string
  contacto: string
  telefone: string
  telemovel: string
  fax: string
  email: string
  url: string
  createdOn: Date
}

