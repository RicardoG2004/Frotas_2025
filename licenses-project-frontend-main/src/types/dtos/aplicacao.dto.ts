export interface CreateAplicacaoDTO {
  nome: string
  descricao: string
  versao: string
  ativo: boolean
  areaId: string
}

export interface UpdateAplicacaoDTO extends Omit<CreateAplicacaoDTO, 'id'> {
  id?: string
}

export interface AplicacaoDTO {
  id: string
  nome: string
  descricao: string
  versao: string
  ativo: boolean
  areaId: string
  area: {
    nome: string
    color: string
  }
  createdOn: string
}
