import { FuncionarioDTO } from '../base/funcionarios.dtos'
import { ViaturaDTO } from './viaturas.dtos'

export interface UtilizacaoDTO {
  id: string
  dataUtilizacao: string
  dataUltimaConferencia?: string
  funcionarioId: string
  funcionario?: FuncionarioDTO
  viaturaId?: string
  viatura?: ViaturaDTO
  horaInicio?: string
  horaFim?: string
  valorCombustivel?: number
  kmPartida?: number
  kmChegada?: number
  totalKmEfectuados?: number
  totalKmConferidos?: number
  totalKmAConferir?: number
  causa?: string
  observacoes?: string
  createdOn: string
}

export interface CreateUtilizacaoDTO {
  dataUtilizacao: string
  dataUltimaConferencia?: string
  funcionarioId: string
  viaturaId?: string
  horaInicio?: string
  horaFim?: string
  valorCombustivel?: number
  kmPartida?: number
  kmChegada?: number
  totalKmEfectuados?: number
  totalKmConferidos?: number
  totalKmAConferir?: number
  causa?: string
  observacoes?: string
}

export interface UpdateUtilizacaoDTO {
  dataUtilizacao: string
  dataUltimaConferencia?: string
  funcionarioId: string
  viaturaId?: string
  horaInicio?: string
  horaFim?: string
  valorCombustivel?: number
  kmPartida?: number
  kmChegada?: number
  totalKmEfectuados?: number
  totalKmConferidos?: number
  totalKmAConferir?: number
  causa?: string
  observacoes?: string
}

