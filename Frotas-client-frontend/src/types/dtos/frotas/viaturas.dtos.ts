export const VIATURA_PROPULSAO_TYPES = ['combustao', 'hibrido', 'eletrico'] as const
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
    designacao?: string
  }
  modeloId: string
  modelo?: {
    id?: string
    designacao?: string
  }
  tipoViaturaId: string
  tipoViatura?: {
    id?: string
    designacao?: string
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
  entidadeFornecedoraTipo: 'fornecedor' | 'terceiro'
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
  urlImagem1: string
  urlImagem2: string
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
  createdOn: string
}

export interface ViaturaInspecaoDTO {
  id?: string
  dataInspecao: string
  resultado: string
  dataProximaInspecao: string
}

export interface ViaturaInspecaoUpsertDTO {
  id?: string
  dataInspecao: string
  resultado: string
  dataProximaInspecao: string
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
  entidadeFornecedoraTipo: 'fornecedor' | 'terceiro'
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
  notasAdicionais: string
  cartaoCombustivel?: string
  anoImpostoSelo: number
  anoImpostoCirculacao: number
  dataValidadeSelo: string
  urlImagem1: string
  urlImagem2: string
  equipamentoIds: string[]
  garantiaIds: string[]
  condutorIds: string[]
  inspecoes: ViaturaInspecaoUpsertDTO[]
  acidentes: ViaturaAcidenteUpsertDTO[]
}

export interface UpdateViaturaDTO extends CreateViaturaDTO {}

export interface DeleteMultipleViaturaDTO {
  ids: string[]
}

