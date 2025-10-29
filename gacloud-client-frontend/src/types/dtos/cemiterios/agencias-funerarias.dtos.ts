import { EntidadeDTO } from '../base/entidades.dtos'

export interface CreateAgenciaFunerariaDTO {
  entidadeId: string
  historico: boolean
}

export interface UpdateAgenciaFunerariaDTO
  extends Omit<CreateAgenciaFunerariaDTO, 'id'> {
  id?: string
}

export interface AgenciaFunerariaDTO {
  id: string
  entidadeId: string
  entidade: EntidadeDTO
  historico: boolean
  createdOn: Date
}
