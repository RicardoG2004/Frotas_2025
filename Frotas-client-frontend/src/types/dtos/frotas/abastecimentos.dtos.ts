import { FuncionarioDTO } from '../base/funcionarios.dtos'
import { ViaturaDTO } from './viaturas.dtos'

export interface AbastecimentoDTO {
  id: string
  data: string
  funcionarioId: string
  funcionario?: FuncionarioDTO
  viaturaId: string
  viatura?: ViaturaDTO
  kms?: number
  litros?: number
  valor?: number
  createdOn: string
}

export interface CreateAbastecimentoDTO {
  data: string
  funcionarioId: string
  viaturaId: string
  kms?: number
  litros?: number
  valor?: number
}

export interface UpdateAbastecimentoDTO {
  data: string
  funcionarioId: string
  viaturaId: string
  kms?: number
  litros?: number
  valor?: number
}

