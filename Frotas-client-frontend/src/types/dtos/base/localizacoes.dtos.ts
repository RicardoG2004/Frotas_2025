import { CodigoPostalDTO } from './codigospostais.dtos'
import { FreguesiaDTO } from './freguesias.dtos'

export interface CreateLocalizacaoDTO {
  designacao: string
  morada: string
  codigoPostalId: string
  freguesiaId: string
  telefone: string
  email: string
  fax: string
}

export interface UpdateLocalizacaoDTO extends Omit<CreateLocalizacaoDTO, 'id'> {
  id?: string
}

export interface LocalizacaoDTO {
  id: string
  designacao: string
  morada: string
  codigoPostalId: string
  codigoPostal: CodigoPostalDTO
  freguesiaId: string
  freguesia: FreguesiaDTO
  telefone: string
  email: string
  fax: string
  createdOn: Date
}

