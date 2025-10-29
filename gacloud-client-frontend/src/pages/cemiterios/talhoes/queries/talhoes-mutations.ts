import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateTalhaoDTO,
  UpdateTalhaoDTO,
  UpdateTalhaoSvgDTO,
} from '@/types/dtos/cemiterios/talhoes.dtos'
import { useAuthStore } from '@/stores/auth-store'
import { TalhoesService } from '@/lib/services/cemiterios/talhoes-service'

export const useDeleteTalhao = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: (id: string) => TalhoesService('talhoes').deleteTalhao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['talhoes-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes-count', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes-select', selectedCemiterio?.id],
      })
    },
  })
}

export const useCreateTalhao = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: async (data: CreateTalhaoDTO) =>
      TalhoesService('talhoes').createTalhao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['talhoes-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes-count', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes-select', selectedCemiterio?.id],
      })
    },
  })
}

export const useUpdateTalhao = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTalhaoDTO }) =>
      TalhoesService('talhoes').updateTalhao(id, {
        ...data,
        id,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['talhoes-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes-count', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes-select', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhao', variables.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhao'],
      })
    },
  })
}

export const useDeleteMultipleTalhoes = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: (ids: string[]) =>
      TalhoesService('talhoes').deleteMultipleTalhoes(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['talhoes-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes-count', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes-select', selectedCemiterio?.id],
      })
    },
  })
}

export const useUpdateTalhaoSvg = () => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore.getState().selectedCemiterio

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTalhaoSvgDTO }) =>
      TalhoesService('talhoes').updateTalhaoSvg(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['talhoes-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes-count', selectedCemiterio?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['talhoes-select', selectedCemiterio?.id],
      })
    },
  })
}
