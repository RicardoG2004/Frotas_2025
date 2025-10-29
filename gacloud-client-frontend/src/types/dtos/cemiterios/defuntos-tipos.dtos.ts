export interface CreateDefuntoTipoDTO {
  descricao: string
}

export interface UpdateDefuntoTipoDTO extends Omit<CreateDefuntoTipoDTO, 'id'> {
  id?: string
}

export interface DefuntoTipoDTO {
  id: string
  descricao: string
  createdOn: Date
}
