import { FuncionarioDTO } from '../base/funcionarios.dtos'
import { ViaturaDTO } from './viaturas.dtos'

export interface ReservaOficinaDTO {
  id: string
  dataReserva: string
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

export interface CreateReservaOficinaDTO {
  dataReserva: string
  funcionarioId: string
  viaturaId?: string
  horaInicio?: string
  horaFim?: string
  causa?: string
  observacoes?: string
}

export interface UpdateReservaOficinaDTO {
  dataReserva: string
  funcionarioId: string
  viaturaId?: string
  horaInicio?: string
  horaFim?: string
  causa?: string
  observacoes?: string
}

