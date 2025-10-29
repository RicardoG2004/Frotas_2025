import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateCemiterioDTO,
  UpdateCemiterioDTO,
} from '@/types/dtos/cemiterios/cemiterios.dtos'
import { CemiteriosService } from '@/lib/services/cemiterios/cemiterios-service'

const CACHE_PREFIX = 'cemiterio_svg_'
const CACHE_VERSION = '1'

const clearSvgCache = (cemiterioId: string) => {
  try {
    const cacheKey = `${CACHE_PREFIX}${CACHE_VERSION}_${cemiterioId}`
    localStorage.removeItem(cacheKey)
  } catch (error) {
    console.error('Error clearing SVG cache:', error)
  }
}

export const useDeleteCemiterio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      CemiteriosService('cemiterios').deleteCemiterio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cemiterios-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios-count'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios-select'] })
    },
  })
}

export const useCreateCemiterio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCemiterioDTO) =>
      CemiteriosService('cemiterios').createCemiterio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cemiterios-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios-count'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios-select'] })
    },
  })
}

export const useUpdateCemiterio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCemiterioDTO }) =>
      CemiteriosService('cemiterios').updateCemiterio(id, { ...data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cemiterios-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios-count'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios-select'] })
    },
  })
}

export const useDeleteMultipleCemiterios = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      CemiteriosService('cemiterios').deleteMultipleCemiterios(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cemiterios-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios-count'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios-select'] })
    },
  })
}

export const useUploadCemiterioSvg = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ svgFile, fileName }: { svgFile: File; fileName: string }) =>
      CemiteriosService('cemiterios').uploadCemiterioSvg(svgFile, fileName),
    onSuccess: (_, variables) => {
      // Extract cemetery ID from filename (assuming filename format is "cemeteryId.svg")
      const cemeteryId = variables.fileName.replace('.svg', '')

      // Clear SVG cache for this cemetery
      clearSvgCache(cemeteryId)

      // Invalidate the SVG query for this specific cemetery
      queryClient.invalidateQueries({ queryKey: ['cemiterio-svg', cemeteryId] })

      // Invalidate other cemetery-related queries
      queryClient.invalidateQueries({ queryKey: ['cemiterios-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios-count'] })
      queryClient.invalidateQueries({ queryKey: ['cemiterios-select'] })
    },
  })
}
