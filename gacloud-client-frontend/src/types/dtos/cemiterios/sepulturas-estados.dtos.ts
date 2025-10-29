export interface CreateSepulturaEstadoDTO {
  descricao: string
}

export interface UpdateSepulturaEstadoDTO
  extends Omit<CreateSepulturaEstadoDTO, 'id'> {
  id?: string
}

export interface SepulturaEstadoDTO {
  id: string
  descricao: string
  createdOn: Date
}
