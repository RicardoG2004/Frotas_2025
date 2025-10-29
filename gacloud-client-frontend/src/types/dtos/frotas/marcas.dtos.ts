export interface CreateMarcaDTO {
  nome: string
}

export interface UpdateMarcaDTO extends Omit<CreateMarcaDTO, 'id'> {
  id?: string
}

export interface MarcaDTO {
  id: string
  nome: string
  createdOn: Date
}

