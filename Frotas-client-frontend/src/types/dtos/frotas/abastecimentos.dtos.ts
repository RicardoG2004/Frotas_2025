import { FuncionarioDTO } from '../base/funcionarios.dtos'
import { ViaturaDTO } from './viaturas.dtos'
import { CombustivelDTO } from './combustiveis.dtos'

export interface AbastecimentoDTO {
  id: string
  data: string
  funcionarioId: string
  funcionario?: FuncionarioDTO
  viaturaId: string
  viatura?: ViaturaDTO
  combustivelId?: string
  combustivel?: CombustivelDTO
  kms?: number
  litros?: number
  valor?: number
  createdOn: string
}

export interface CreateAbastecimentoDTO {
  data: string
  funcionarioId: string
  viaturaId: string
  combustivelId?: string
  kms?: number
  litros?: number
  valor?: number
}

export interface UpdateAbastecimentoDTO {
  data: string
  funcionarioId: string
  viaturaId: string
  combustivelId?: string
  kms?: number
  litros?: number
  valor?: number
}

