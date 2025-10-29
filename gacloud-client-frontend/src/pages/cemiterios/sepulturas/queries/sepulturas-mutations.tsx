import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateSepulturaDTO,
  UpdateSepulturaDTO,
  UpdateSepulturaSvgDTO,
} from '@/types/dtos/cemiterios/sepulturas.dtos'
import { useAuthStore } from '@/stores/auth-store'
import { SepulturasService } from '@/lib/services/cemiterios/sepulturas-service'

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

export const useDeleteSepultura = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: (id: string) =>
      SepulturasService('sepulturas').deleteSepultura(id),
    onSuccess: () => {
      if (selectedCemiterio?.id) {
        clearSvgCache(selectedCemiterio.id)
      }
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['sepulturas'] })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['proprietarios'] })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-select'],
      })

      // Invalidate all individual proprietario queries to ensure updated data
      queryClient.invalidateQueries({
        queryKey: ['proprietario'],
        exact: false,
      })
    },
  })
}

export const useCreateSepultura = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: async (data: CreateSepulturaDTO) =>
      SepulturasService('sepulturas').createSepultura(data),
    onSuccess: (_, variables) => {
      if (selectedCemiterio?.id) {
        clearSvgCache(selectedCemiterio.id)
      }
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['sepulturas'] })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['proprietarios'] })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-select'],
      })

      // Invalidate individual proprietario queries for each proprietario in the request
      if (variables.proprietarios) {
        variables.proprietarios.forEach((proprietario) => {
          if (proprietario.proprietarioId) {
            queryClient.invalidateQueries({
              queryKey: ['proprietario', proprietario.proprietarioId],
            })
          }
        })
      }
    },
  })
}

export const useUpdateSepultura = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSepulturaDTO }) =>
      SepulturasService('sepulturas').updateSepultura(id, { ...data, id }),
    onSuccess: (_, { id, data }) => {
      // Get the original sepultura data from cache to identify removed proprietarios
      const originalData = queryClient.getQueryData(['sepultura', id]) as any
      const originalProprietarios =
        originalData?.info?.data?.proprietarios || []
      const newProprietarios = data.proprietarios || []

      // Find proprietarios that were removed
      const removedProprietarios = originalProprietarios.filter(
        (originalProprietario: any) =>
          !newProprietarios.some(
            (newProprietario) =>
              newProprietario.proprietarioId ===
              originalProprietario.proprietarioId
          )
      )

      if (selectedCemiterio?.id) {
        clearSvgCache(selectedCemiterio.id)
      }
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['sepulturas'] })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepultura', id],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['proprietarios'] })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-select'],
      })

      // Invalidate AND refetch ALL proprietarios that were associated with this sepultura (both removed and remaining)
      // This ensures the proprietario pages show the updated sepultura information
      const allAffectedProprietarios = [
        ...removedProprietarios.map((p: any) => p.proprietarioId),
        ...(data.proprietarios || []).map((p) => p.proprietarioId),
      ].filter(Boolean)

      allAffectedProprietarios.forEach((proprietarioId) => {
        queryClient.invalidateQueries({
          queryKey: ['proprietario', proprietarioId],
        })
        // Force refetch immediately since the query has refetchOnMount: false
        queryClient.refetchQueries({
          queryKey: ['proprietario', proprietarioId],
        })
      })
    },
  })
}

export const useDeleteMultipleSepulturas = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: (ids: string[]) =>
      SepulturasService('sepulturas').deleteMultipleSepulturas(ids),
    onSuccess: () => {
      if (selectedCemiterio?.id) {
        clearSvgCache(selectedCemiterio.id)
      }
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['sepulturas'] })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['proprietarios'] })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-select'],
      })
    },
  })
}

export const useUpdateSepulturaSvg = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSepulturaSvgDTO }) =>
      SepulturasService('sepulturas').updateSepulturaSvg(id, data),
    onSuccess: () => {
      if (selectedCemiterio?.id) {
        clearSvgCache(selectedCemiterio.id)
      }
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-count', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-select', selectedCemiterio?.id],
      })
    },
  })
}
