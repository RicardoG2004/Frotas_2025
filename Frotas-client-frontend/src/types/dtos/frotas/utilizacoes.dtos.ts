import { FuncionarioDTO } from '../base/funcionarios.dtos'
import { ViaturaDTO } from './viaturas.dtos'

export interface UtilizacaoDTO {
  id: string
  dataUtilizacao: string
  funcionarioId: string
  funcionario?: FuncionarioDTO
  viaturaId?: string
  viatura?: ViaturaDTO
  horaInicio?: string
  horaFim?: string
  causa?: string
  observacoes?: string
  createdOn: string
}

export interface CreateUtilizacaoDTO {
  dataUtilizacao: string
  funcionarioId: string
  viaturaId?: string
  horaInicio?: string
  horaFim?: string
  causa?: string
  observacoes?: string
}

export interface UpdateUtilizacaoDTO {
  dataUtilizacao: string
  funcionarioId: string
  viaturaId?: string
  horaInicio?: string
  horaFim?: string
  causa?: string
  observacoes?: string
}

