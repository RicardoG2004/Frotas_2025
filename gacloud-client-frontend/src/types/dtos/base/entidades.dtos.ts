import { CartaoIdentificacaoTipo } from '../../enums/cartao-identificacao-tipo.enum'
import { EstadoCivil } from '../../enums/estado-civil.enum'
import { EstadoCivilDTO } from './estadoscivis.dtos'
import { RuaDTO } from './ruas.dtos'

export interface EntidadeContacto {
  id: string
  entidadeContactoTipoId: number
  entidadeId: string
  valor: string
  principal: boolean
  createdOn: Date
}

export interface CreateEntidadeDTO {
  Nome: string
  NIF: string
  NIFEstrangeiro: boolean
  RuaId: string
  RuaNumeroPorta: string
  RuaAndar?: string
  CartaoIdentificacaoTipoId: number
  CartaoIdentificacaoNumero: string
  CartaoIdentificacaoDataEmissao: Date
  CartaoIdentificacaoDataValidade: Date
  EstadoCivilId: number
  Sexo: string
  Ativo: boolean
  Historico: boolean
  Contactos?: EntidadeContactoPayload[]
}

export interface UpdateEntidadeDTO extends Omit<CreateEntidadeDTO, 'id'> {
  id?: string
}

export interface EntidadeDTO {
  id: string
  nome: string
  createdOn: Date
  nif: string
  nifEstrangeiro: boolean
  ruaId: string
  rua: RuaDTO
  ruaNumeroPorta: string
  ruaAndar?: string
  cartaoIdentificacaoTipoId: CartaoIdentificacaoTipo
  cartaoIdentificacaoNumero: string
  cartaoIdentificacaoDataEmissao: string
  cartaoIdentificacaoDataValidade: string
  estadoCivilId: EstadoCivil
  estadoCivil: EstadoCivilDTO
  sexo: string
  ativo: boolean
  historico: boolean
  entidadeTipoId: string
  contactos?: EntidadeContacto[]
}

export interface EntidadeContactoPayload {
  EntidadeContactoTipoId: number
  Valor: string
  Principal: boolean
}
