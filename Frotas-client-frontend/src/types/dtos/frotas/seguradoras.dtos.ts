export interface CreateSeguradoraDTO {
  descricao: string
}

export interface UpdateSeguradoraDTO extends Omit<CreateSeguradoraDTO, 'id'> {
  id?: string
}

export interface SeguradoraDTO {
  id: string
  descricao: string
  createdOn: Date
}


