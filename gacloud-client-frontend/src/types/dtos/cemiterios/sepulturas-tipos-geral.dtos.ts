export interface CreateSepulturaTipoGeralDTO {
  descricao: string
}

export interface UpdateSepulturaTipoGeralDTO
  extends Omit<CreateSepulturaTipoGeralDTO, 'id'> {
  id?: string
}

export interface SepulturaTipoGeralDTO {
  id: string
  descricao: string
  createdOn: Date
}
