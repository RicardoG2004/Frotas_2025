export interface CreateEpocaDTO {
  ano: string
  descricao: string
  predefinida: boolean
  bloqueada: boolean
  epocaAnteriorId: string
}

export interface UpdateEpocaDTO extends Omit<CreateEpocaDTO, 'id'> {
  id?: string
}

export interface EpocaDTO {
  id: string
  ano: string
  descricao: string
  predefinida: boolean
  bloqueada: boolean
  epocaAnteriorId: string
  epocaAnterior: {
    id: string
    descricao: string
  }
  createdOn: Date
}
