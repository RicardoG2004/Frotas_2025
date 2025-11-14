export interface CreateCargoDTO {
  Designacao: string
}

export interface UpdateCargoDTO extends Omit<CreateCargoDTO, 'id'> {
  id?: string
}

export interface CargoDTO {
  id: string
  designacao: string
  createdOn: Date
}


