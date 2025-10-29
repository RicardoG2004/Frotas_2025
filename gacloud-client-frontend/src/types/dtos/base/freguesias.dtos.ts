import { ConcelhoDTO } from '../base/concelhos.dtos'

export interface CreateFreguesiaDTO {
  nome: string
  concelhoId: string
}

export interface UpdateFreguesiaDTO extends Omit<CreateFreguesiaDTO, 'id'> {
  id?: string
}

export interface FreguesiaDTO {
  id: string
  nome: string
  concelhoId: string
  concelho: ConcelhoDTO
  createdOn: Date
}
