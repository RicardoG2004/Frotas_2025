import { CemiterioDTO } from './cemiterios.dtos'

export interface CreateZonaDTO {
  nome: string
  cemiterioId: string
  shapeId?: string // Add shapeId field
}

export interface UpdateZonaDTO {
  id: string
  nome: string
  cemiterioId: string
  shapeId?: string // Add shapeId field
}

export interface UpdateZonaSvgDTO {
  temSvgShape: boolean
  shapeId?: string | null // Add shapeId field
}

export interface ZonaDTO {
  id: string
  nome: string
  cemiterioId: string
  cemiterio: CemiterioDTO
  temSvgShape: boolean
  shapeId?: string // Add shapeId field to store the shape ID
  createdOn: Date
}
