export interface CreateCorDTO {
  designacao: string
}

export interface UpdateCorDTO extends Omit<CreateCorDTO, 'id'> {
  id?: string
}

export interface CorDTO {
  id: string
  designacao: string
  createdOn: Date
}


