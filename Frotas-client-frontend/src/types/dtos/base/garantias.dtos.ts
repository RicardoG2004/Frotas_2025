export interface CreateGarantiaDTO {
  designacao: string
  anos: number
  kms: number
}

export interface UpdateGarantiaDTO extends Omit<CreateGarantiaDTO, 'id'> {
  id?: string
}

export interface GarantiaDTO {
  id: string
  designacao: string
  anos: number
  kms: number
  createdOn: Date
}


