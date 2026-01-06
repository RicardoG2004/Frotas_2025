import type { AplicacaoDTO } from './aplicacao.dto'

export enum UpdateType {
  API = 1,
  Frontend = 2,
  Both = 3,
}

export interface AppUpdateDTO {
  id: string
  versao: string
  descricao: string
  ficheiroUpdate: string | null
  tamanhoFicheiro: number
  hashFicheiro: string | null
  // API package fields (used when tipoUpdate is API or Both)
  ficheiroUpdateApi: string | null
  tamanhoFicheiroApi: number
  hashFicheiroApi: string | null
  // Frontend package fields (used when tipoUpdate is Frontend or Both)
  ficheiroUpdateFrontend: string | null
  tamanhoFicheiroFrontend: number
  hashFicheiroFrontend: string | null
  dataLancamento: string // ISO 8601 date string
  ativo: boolean
  obrigatorio: boolean
  versaoMinima: string | null
  tipoUpdate: UpdateType // 1 = API, 2 = Frontend, 3 = Both
  aplicacaoId: string
  aplicacao: AplicacaoDTO
  notasAtualizacao: string | null
  clienteIds?: string[] // Optional: Array of client IDs for targeted release
  createdOn?: string // ISO date
}

export interface CreateAppUpdateDTO {
  versao: string // e.g., "1.2.3"
  descricao: string
  dataLancamento: string // ISO 8601 date string
  ativo: boolean
  obrigatorio: boolean // Whether update is mandatory
  versaoMinima?: string // Optional, Minimum version required to apply this update
  tipoUpdate: UpdateType // Required: 1 = API, 2 = Frontend, 3 = Both (default: 3)
  aplicacaoId: string // GUID
  notasAtualizacao?: string // Optional, Release notes
  clienteIds?: string[] // Optional: Array of client IDs for targeted release. If empty/null, release to all clients
}

export interface UpdateAppUpdateDTO extends CreateAppUpdateDTO {
  id?: string
}

export interface CheckUpdateRequest {
  versaoAtual: string // Current application version
  aplicacaoId: string // GUID
}

export interface CheckUpdateResponse {
  updateAvailable: boolean
  latestVersion: string | null
  isMandatory: boolean
  releaseNotes: string | null
  updateId: string | null
}

export interface AppUpdateStatisticsDTO {
  totalUpdates: number
  activeUpdates: number
  mandatoryUpdates: number
  latestVersion: string | null
  latestReleaseDate: string | null // ISO 8601 date string
  totalFileSize: number // Bytes
}

export interface UpdateInfo {
  updateAvailable: boolean
  latestVersion: string | null
  isMandatory: boolean
  releaseNotes: string | null
  updateId?: string | null
}

export interface AppUpdateTableFilter {
  pageNumber: number
  pageSize: number
  sorting: Array<{
    id: string
    desc: boolean
  }>
  filters: Array<{
    id: string
    value: string
  }>
  keyword?: string
  aplicacaoId: string
}
