import { CodigoPostalDTO } from './codigospostais.dtos'
import { FreguesiaDTO } from './freguesias.dtos'

export interface CreateRuaDTO {
  nome: string
  freguesiaId: string
  codigoPostalId: string
}

export interface UpdateRuaDTO extends Omit<CreateRuaDTO, 'id'> {
  id?: string
}

export interface RuaDTO {
  id: string
  nome: string
  freguesiaId: string
  freguesia: FreguesiaDTO
  codigoPostalId: string
  codigoPostal: CodigoPostalDTO
  createdOn: Date
}
