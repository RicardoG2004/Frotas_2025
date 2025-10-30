import { DistritoDTO } from './distritos.dtos'

export interface CreateConcelhoDTO {
  nome: string
  distritoId: string
}

export interface UpdateConcelhoDTO extends Omit<CreateConcelhoDTO, 'id'> {
  id?: string
}

export interface ConcelhoDTO {
  id: string
  nome: string
  distritoId: string
  distrito: DistritoDTO
  createdOn: Date
}
