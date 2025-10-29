import { ZonaDTO } from './zonas.dtos'

export interface UpdateTalhaoSvgDTO {
  temSvgShape: boolean
  shapeId?: string | null // Add shapeId field
}

export interface CreateTalhaoDTO {
  nome: string
  zonaId: string
  shapeId?: string // Add shapeId field
}

export interface UpdateTalhaoDTO {
  id: string
  nome: string
  zonaId: string
  shapeId?: string // Add shapeId field
}

export interface TalhaoDTO {
  id: string
  nome: string
  zonaId: string
  zona: ZonaDTO
  temSvgShape: boolean
  shapeId?: string // Add shapeId field to store the shape ID
  createdOn: Date
}
