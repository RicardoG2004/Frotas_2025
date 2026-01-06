export interface CreateClienteDTO {
  nome: string
  sigla: string
  dadosExternos?: boolean
  dadosUrl?: string
  ativo?: boolean
  nif?: string
}

export interface UpdateClienteDTO extends CreateClienteDTO {
  id?: string
}

export interface ClienteDTO {
  id: string
  nome: string
  sigla: string
  dadosExternos?: boolean
  dadosUrl?: string
  ativo?: boolean
  nif?: string
}
