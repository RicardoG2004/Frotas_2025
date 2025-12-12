import { FseDTO } from '../base/fses.dtos'
import { FuncionarioDTO } from '../base/funcionarios.dtos'
import { ViaturaDTO } from './viaturas.dtos'
import { ServicoDTO } from './servicos.dtos'
import { PecaDTO } from './pecas.dtos'

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
  manutencaoPecas?: ManutencaoPecaDTO[] | null
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

export interface ManutencaoPecaDTO {
  id: string
  manutencaoId: string
  pecaId: string
  peca?: PecaDTO | null
  quantidade: number
  garantia?: number | null
  validade?: string | null
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
  pecas?: CreateManutencaoPecaDTO[]
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

export interface CreateManutencaoPecaDTO {
  pecaId: string
  quantidade: number
  garantia?: number | null
  validade?: string | null
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
  pecas?: CreateManutencaoPecaDTO[]
}

