export interface CreateCodigoPostalDTO {
  codigo: string
  localidade: string
}

export interface UpdateCodigoPostalDTO
  extends Omit<CreateCodigoPostalDTO, 'id'> {
  id?: string
}

export interface CodigoPostalDTO {
  id: string
  codigo: string
  localidade: string
  createdOn: Date
}
