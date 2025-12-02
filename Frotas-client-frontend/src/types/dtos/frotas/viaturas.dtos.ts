import type { CategoriaInspecao } from './tipo-viaturas.dtos'

export const VIATURA_PROPULSAO_TYPES = ['combustao', 'hibrido', 'hibridoPlugIn', 'eletrico'] as const
export type ViaturaPropulsao = (typeof VIATURA_PROPULSAO_TYPES)[number]

export interface ViaturaDTO {
  id: string
  matricula: string
  anoFabrico: number
  mesFabrico: number
  dataAquisicao: string
  dataLivrete: string
  marcaId: string
  marca?: {
    id?: string
    nome?: string
  }
  modeloId: string
  modelo?: {
    id?: string
    nome?: string
  }
  tipoViaturaId: string
  tipoViatura?: {
    id?: string
    designacao?: string
    // Categoria necessária para calcular as datas de inspeção baseado nas regras
    categoriaInspecao?: CategoriaInspecao
  }
  corId: string
  cor?: {
    id?: string
    designacao?: string
  }
  combustivelId: string
  combustivel?: {
    id?: string
    designacao?: string
  }
  tipoPropulsao: ViaturaPropulsao
  conservatoriaId: string
  conservatoria?: {
    id?: string
    designacao?: string
  }
  categoriaId: string
  categoria?: {
    id?: string
    designacao?: string
  }
  localizacaoId: string
  localizacao?: {
    id?: string
    designacao?: string
  }
  setorId: string
  setor?: {
    id?: string
    descricao?: string
  }
  delegacaoId: string
  delegacao?: {
    id?: string
    designacao?: string
  }
  numero: number
  custo: number
  despesasIncluidas: number
  consumoMedio: number
  autonomia?: number | null
  terceiroId: string | null
  terceiro?: {
    id?: string
    nome?: string
  }
  fornecedorId: string | null
  fornecedor?: {
    id?: string
    nome?: string
  }
  entidadeFornecedoraTipo: 'fornecedor' | 'terceiro' | null
  nQuadro: number
  nMotor: number
  cilindrada: number | null
  potencia: number
  capacidadeBateria?: number | null
  tara: number
  lotacao: number
  marketing: boolean
  mercadorias: boolean
  cargaUtil: number
  comprimento: number
  largura: number
  pneusFrente: string
  pneusTras: string
  contrato: string
  dataInicial: string
  dataFinal: string
  valorTotalContrato: number
  opcaoCompra: boolean
  nRendas: number
  valorRenda: number
  valorResidual: number
  seguroIds: string[]
  seguros?: Array<{
    id?: string
    designacao?: string
  }>
  notasAdicionais: string
  anoImpostoSelo: number
  anoImpostoCirculacao: number
  dataValidadeSelo: string
  imagem?: string | null
  documentos?: string | null
  cartaoCombustivel?: string
  equipamentoIds: string[]
  equipamentos?: Array<{
    id?: string
    designacao?: string
  }>
  garantiaIds: string[]
  garantias?: Array<{
    id?: string
    designacao?: string
  }>
  condutorIds: string[]
  condutores?: Array<{
    id?: string
    nome?: string
  }>
  inspecoes?: ViaturaInspecaoDTO[]
  acidentes?: ViaturaAcidenteDTO[]
  multas?: ViaturaMultaDTO[]
  createdOn: string
}

export interface ViaturaInspecaoDTO {
  id?: string
  dataInspecao: string
  resultado: string
  dataProximaInspecao: string
  // Campo para documentos anexados a esta inspeção
  // Porquê: Permite anexar documentos específicos de cada inspeção (certificados, relatórios, etc.)
  documentos?: string | null
}

export interface ViaturaInspecaoUpsertDTO {
  id?: string
  dataInspecao: string
  resultado: string
  dataProximaInspecao: string
  // Campo para enviar documentos anexados a esta inspeção
  documentos?: string | null
}

export interface ViaturaAcidenteDTO {
  id?: string
  condutorId: string
  dataHora: string
  culpa: boolean
  descricaoAcidente?: string
  descricaoDanos?: string
  local?: string
  concelhoId?: string
  freguesiaId?: string
  codigoPostalId?: string
  localReparacao?: string
}

export interface ViaturaAcidenteUpsertDTO {
  id?: string
  condutorId: string
  dataHora: string
  culpa: boolean
  descricaoAcidente?: string
  descricaoDanos?: string
  local?: string
  concelhoId?: string
  freguesiaId?: string
  codigoPostalId?: string
  localReparacao?: string
}

export interface ViaturaMultaDTO {
  id?: string
  condutorId: string
  dataHora: string
  local: string
  motivo: string
  valor: number
}

export interface ViaturaMultaUpsertDTO {
  id?: string
  condutorId: string
  dataHora: string
  local: string
  motivo: string
  valor: number
}

export interface CreateViaturaDTO {
  matricula: string
  anoFabrico: number
  mesFabrico: number
  dataAquisicao: string
  dataLivrete: string
  marcaId: string
  modeloId: string
  tipoViaturaId: string
  corId: string
  combustivelId: string
  tipoPropulsao: ViaturaPropulsao
  conservatoriaId: string
  categoriaId: string
  localizacaoId: string
  setorId: string
  delegacaoId: string
  numero: number
  custo: number
  despesasIncluidas: number
  consumoMedio: number
  autonomia?: number | null
  terceiroId: string | null
  fornecedorId: string | null
  entidadeFornecedoraTipo: 'fornecedor' | 'terceiro' | null
  nQuadro: number
  nMotor: number
  cilindrada: number | null
  potencia: number
  capacidadeBateria?: number | null
  tara: number
  lotacao: number
  marketing: boolean
  mercadorias: boolean
  cargaUtil: number
  comprimento: number
  largura: number
  pneusFrente: string
  pneusTras: string
  contrato: string
  dataInicial: string
  dataFinal: string
  valorTotalContrato: number
  opcaoCompra: boolean
  nRendas: number
  valorRenda: number
  valorResidual: number
  seguroIds: string[]
  documentos?: string | null
  notasAdicionais: string
  cartaoCombustivel?: string
  anoImpostoSelo: number
  anoImpostoCirculacao: number
  dataValidadeSelo: string
  imagem?: string | null
  equipamentoIds: string[]
  garantiaIds: string[]
  condutorIds: string[]
  inspecoes: ViaturaInspecaoUpsertDTO[]
  acidentes: ViaturaAcidenteUpsertDTO[]
  multas: ViaturaMultaUpsertDTO[]
}

export interface UpdateViaturaDTO extends CreateViaturaDTO {}

export interface DeleteMultipleViaturaDTO {
  ids: string[]
}

