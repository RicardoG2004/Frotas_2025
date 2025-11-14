import { CodigoPostalDTO } from './codigospostais.dtos'
import { FreguesiaDTO } from './freguesias.dtos'
import { CargoDTO } from './cargos.dtos'
import { DelegacaoDTO } from './delegacoes.dtos'

export interface CreateFuncionarioDTO {
  Nome: string
  Morada: string
  CodigoPostalId: string
  FreguesiaId: string
  CargoId: string
  Email: string
  Telefone: string
  DelegacaoId: string
  Ativo: boolean
}

export interface UpdateFuncionarioDTO extends Omit<CreateFuncionarioDTO, 'id'> {
  id?: string
}

export interface FuncionarioDTO {
  id: string
  nome: string
  morada: string
  codigoPostalId: string
  codigoPostal: CodigoPostalDTO
  freguesiaId: string
  freguesia: FreguesiaDTO
  cargoId: string
  cargo: CargoDTO
  email: string
  telefone: string
  delegacaoId: string
  delegacao: DelegacaoDTO
  ativo: boolean
  createdOn: Date
}


