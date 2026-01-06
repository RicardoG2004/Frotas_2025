export interface CreateFuncionalidadeDTO {
  nome: string
  descricao: string
  moduloId: string
  ativo: boolean
}

export interface UpdateFuncionalidadeDTO extends CreateFuncionalidadeDTO {
  id?: string
}

export interface FuncionalidadeDTO {
  id: string
  nome: string
  descricao: string
  moduloId: string
  ativo?: boolean
  modulo?: {
    nome: string
    aplicacao: {
      nome: string
      area: {
        nome: string
        color: string
      }
    }
  }
  createdOn: string
}

export interface FuncionalidadePerfilDTO {
  id: string
  moduloId: string
  nome: string
}
