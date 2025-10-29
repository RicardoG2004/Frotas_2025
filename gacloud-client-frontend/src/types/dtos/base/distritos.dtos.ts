import { PaisDTO } from './paises.dtos'

export interface CreateDistritoDTO {
  nome: string
  paisId: string
}

export interface UpdateDistritoDTO extends Omit<CreateDistritoDTO, 'id'> {
  id?: string
}

export interface DistritoDTO {
  id: string
  nome: string
  paisId: string
  pais: PaisDTO
  createdOn: Date
}
