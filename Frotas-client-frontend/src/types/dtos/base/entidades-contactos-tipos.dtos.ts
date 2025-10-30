export interface CreateEntidadeContactoTipoDTO {
  nome: string
  tipo: number
}

export interface UpdateEntidadeContactoTipoDTO
  extends Omit<CreateEntidadeContactoTipoDTO, 'id'> {
  id?: string
}

export interface EntidadeContactoTipoDTO {
  id: string
  nome: string
  tipo: number
  createdOn: Date
}
