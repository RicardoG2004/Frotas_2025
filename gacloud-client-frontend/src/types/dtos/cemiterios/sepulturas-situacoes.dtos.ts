export interface CreateSepulturaSituacaoDTO {
  descricao: string
}

export interface UpdateSepulturaSituacaoDTO
  extends Omit<CreateSepulturaSituacaoDTO, 'id'> {
  id?: string
}

export interface SepulturaSituacaoDTO {
  id: string
  descricao: string
  createdOn: Date
}
