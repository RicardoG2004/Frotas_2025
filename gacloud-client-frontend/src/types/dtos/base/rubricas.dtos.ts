import { EpocaDTO } from '../base/epocas.dtos'

export interface CreateRubricaDTO {
  codigo: string
  epocaId: string
  descricao: string
  classificacaoTipo: string
  rubricaTipo: number
}

export interface UpdateRubricaDTO extends Omit<CreateRubricaDTO, 'id'> {
  id?: string
}

export interface RubricaDTO {
  id: string
  codigo: string
  epocaId: string
  epoca: EpocaDTO
  descricao: string
  classificacaoTipo: string
  rubricaTipo: number
  createdOn: Date
}
