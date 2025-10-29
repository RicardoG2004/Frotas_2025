export interface CreatePaisDTO {
  codigo: string
  nome: string
  prefixo: string
}

export interface UpdatePaisDTO extends Omit<CreatePaisDTO, 'id'> {
  id?: string
}

export interface PaisDTO {
  id: string
  codigo: string
  nome: string
  prefixo: string
  createdOn: Date
}
