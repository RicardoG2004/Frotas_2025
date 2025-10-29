import { SepulturaDTO } from '@/types/dtos/cemiterios/sepulturas.dtos'
import { TalhaoDTO } from '@/types/dtos/cemiterios/talhoes.dtos'
import { ZonaDTO } from '@/types/dtos/cemiterios/zonas.dtos'

/**
 * Filters sepulturas that have shapes (shapeId is not null/undefined)
 */
export const filterSepulturasWithShapes = (
  sepulturas: SepulturaDTO[]
): SepulturaDTO[] => {
  return sepulturas.filter(
    (sepultura) => sepultura.shapeId && sepultura.shapeId.trim() !== ''
  )
}

/**
 * Filters talhões that have shapes (shapeId is not null/undefined)
 */
export const filterTalhoesWithShapes = (talhoes: TalhaoDTO[]): TalhaoDTO[] => {
  return talhoes.filter(
    (talhao) => talhao.shapeId && talhao.shapeId.trim() !== ''
  )
}

/**
 * Filters zonas that have shapes (shapeId is not null/undefined)
 */
export const filterZonasWithShapes = (zonas: ZonaDTO[]): ZonaDTO[] => {
  return zonas.filter((zona) => zona.shapeId && zona.shapeId.trim() !== '')
}

/**
 * Gets all shape IDs from sepulturas that have shapes
 */
export const getShapeIdsFromSepulturas = (
  sepulturas: SepulturaDTO[]
): string[] => {
  return sepulturas
    .filter((sepultura) => sepultura.shapeId && sepultura.shapeId.trim() !== '')
    .map((sepultura) => sepultura.shapeId!)
}

/**
 * Gets all shape IDs from talhões that have shapes
 */
export const getShapeIdsFromTalhoes = (talhoes: TalhaoDTO[]): string[] => {
  return talhoes
    .filter((talhao) => talhao.shapeId && talhao.shapeId.trim() !== '')
    .map((talhao) => talhao.shapeId!)
}

/**
 * Gets all shape IDs from zonas that have shapes
 */
export const getShapeIdsFromZonas = (zonas: ZonaDTO[]): string[] => {
  return zonas
    .filter((zona) => zona.shapeId && zona.shapeId.trim() !== '')
    .map((zona) => zona.shapeId!)
}

/**
 * Checks if a sepultura has a shape
 */
export const hasShape = (
  entity: SepulturaDTO | TalhaoDTO | ZonaDTO
): boolean => {
  return !!(entity.shapeId && entity.shapeId.trim() !== '')
}
