import {
  ProprietarioSepulturaDTO,
  CreateProprietarioSepulturaFromSepulturaDTO,
  UpdateProprietarioSepulturaDTO,
} from './proprietarios.dtos'
import { SepulturaTipoDTO } from './sepulturas-tipos.dtos'
import { TalhaoDTO } from './talhoes.dtos'

export interface CreateSepulturaDTO {
  nome: string
  talhaoId: string
  sepulturaTipoId: string
  sepulturaEstadoId: number
  sepulturaSituacaoId: number
  largura?: number
  comprimento?: number
  area?: number
  profundidade?: number
  fila?: string
  coluna?: string
  dataConcessao?: Date
  dataInicioAluguer?: Date
  dataFimAluguer?: Date
  dataInicioReserva?: Date
  dataFimReserva?: Date
  dataConhecimento?: Date
  numeroConhecimento?: string
  fundura1: boolean
  fundura2: boolean
  fundura3: boolean
  anulado: boolean
  dataAnulacao?: Date
  observacao?: string
  bloqueada: boolean
  litigio?: boolean
  shapeId?: string // Add shapeId field
  proprietarios?: CreateProprietarioSepulturaFromSepulturaDTO[]
}

export interface UpdateSepulturaDTO extends CreateSepulturaDTO {
  id: string
  proprietarios?: UpdateProprietarioSepulturaDTO[]
}

export interface SepulturaDTO {
  id: string
  nome: string
  talhaoId: string
  talhao?: TalhaoDTO
  sepulturaTipoId: string
  sepulturaTipo?: SepulturaTipoDTO
  sepulturaEstadoId: number
  sepulturaSituacaoId: number
  dataConcessao?: Date
  largura?: number
  comprimento?: number
  area?: number
  profundidade?: number
  fila?: string
  coluna?: string
  dataInicioAluguer?: Date
  dataFimAluguer?: Date
  dataInicioReserva?: Date
  dataFimReserva?: Date
  numeroConhecimento?: string
  dataConhecimento?: Date
  fundura1: boolean
  fundura2: boolean
  fundura3: boolean
  anulado: boolean
  dataAnulacao?: Date
  observacao?: string
  bloqueada: boolean
  litigio?: boolean
  createdOn: Date
  temSvgShape: boolean
  shapeId?: string // Add shapeId field to store the shape ID
  proprietarios?: ProprietarioSepulturaDTO[]
}

export interface UpdateSepulturaSvgDTO {
  temSvgShape: boolean
  shapeId?: string | null // Add shapeId field
}
