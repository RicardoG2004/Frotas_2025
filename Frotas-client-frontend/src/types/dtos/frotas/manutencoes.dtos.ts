import { FseDTO } from '../base/fses.dtos'
import { FuncionarioDTO } from '../base/funcionarios.dtos'
import { ViaturaDTO } from './viaturas.dtos'
import { ServicoDTO } from './servicos.dtos'

export interface ManutencaoDTO {
  id: string
  dataRequisicao: string
  fseId: string
  fse?: FseDTO | null
  funcionarioId: string
  funcionario?: FuncionarioDTO | null
  dataEntrada: string
  horaEntrada: string
  dataSaida: string
  horaSaida: string
  viaturaId: string
  viatura?: ViaturaDTO | null
  kmsRegistados: number
  totalSemIva: number
  valorIva: number
  total: number
  manutencaoServicos?: ManutencaoServicoDTO[] | null
  createdOn: string
}

export interface ManutencaoServicoDTO {
  id: string
  manutencaoId: string
  servicoId: string
  servico?: ServicoDTO | null
  quantidade: number
  kmProxima?: number | null
  dataProxima?: string | null
  valorSemIva: number
  ivaPercentagem: number
  valorTotal: number
  createdOn: string
}

export interface CreateManutencaoDTO {
  dataRequisicao: string
  fseId: string
  funcionarioId: string
  dataEntrada: string
  horaEntrada: string
  dataSaida: string
  horaSaida: string
  viaturaId: string
  kmsRegistados: number
  totalSemIva: number
  valorIva: number
  total: number
  servicos?: CreateManutencaoServicoDTO[]
}

export interface CreateManutencaoServicoDTO {
  servicoId: string
  quantidade: number
  kmProxima?: number | null
  dataProxima?: string | null
  valorSemIva: number
  ivaPercentagem: number
  valorTotal: number
}

export interface UpdateManutencaoDTO {
  dataRequisicao: string
  fseId: string
  funcionarioId: string
  dataEntrada: string
  horaEntrada: string
  dataSaida: string
  horaSaida: string
  viaturaId: string
  kmsRegistados: number
  totalSemIva: number
  valorIva: number
  total: number
  servicos?: CreateManutencaoServicoDTO[]
}

