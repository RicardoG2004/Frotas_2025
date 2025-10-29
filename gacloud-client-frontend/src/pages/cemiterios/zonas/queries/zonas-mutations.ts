import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateZonaDTO,
  UpdateZonaDTO,
  UpdateZonaSvgDTO,
} from '@/types/dtos/cemiterios/zonas.dtos'
import { useAuthStore } from '@/stores/auth-store'
import { ZonasService } from '@/lib/services/cemiterios/zonas-service'

export const useDeleteZona = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: (id: string) => ZonasService('zonas').deleteZona(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['zonas-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas-count', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas-select', selectedCemiterio?.id],
      })
    },
  })
}

export const useCreateZona = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: async (data: CreateZonaDTO) =>
      ZonasService('zonas').createZona(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['zonas-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas-count', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas-select', selectedCemiterio?.id],
      })
    },
  })
}

export const useUpdateZona = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateZonaDTO }) =>
      ZonasService('zonas').updateZona(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['zonas-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas-count', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas-select', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['zona', variables.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['zona'],
      })
    },
  })
}

export const useDeleteMultipleZonas = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: (ids: string[]) =>
      ZonasService('zonas').deleteMultipleZonas(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['zonas-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas-count', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas-select', selectedCemiterio?.id],
      })
    },
  })
}

export const useUpdateZonaSvg = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateZonaSvgDTO }) =>
      ZonasService('zonas').updateZonaSvg(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['zonas-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas-count', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['zonas-select', selectedCemiterio?.id],
      })
    },
  })
}
