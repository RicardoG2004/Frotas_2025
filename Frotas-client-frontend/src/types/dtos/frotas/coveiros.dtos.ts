import { CodigoPostalDTO } from '../base/codigospostais.dtos'
import { RuaDTO } from '../base/ruas.dtos'

export interface CreateCoveiroDTO {
  nome: string
  ruaId: string
  codigoPostalId: string
  historico: boolean
}

export interface UpdateCoveiroDTO extends Omit<CreateCoveiroDTO, 'id'> {
  id?: string
}

export interface CoveiroDTO {
  id: string
  nome: string
  ruaId: string
  rua: RuaDTO
  codigoPostalId: string
  codigoPostal: CodigoPostalDTO
  historico: boolean
  createdOn: Date
}
