import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateCombustivelDTO,
  UpdateCombustivelDTO,
} from '@/types/dtos/frotas/combustiveis.dtos'
import { CombustiveisService } from '@/lib/services/frotas/combustiveis-service'

export const useDeleteCombustivel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => CombustiveisService('combustivel').deleteCombustivel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['combustiveis-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['combustiveis'] })
      queryClient.invalidateQueries({
        queryKey: ['combustiveis-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['combustiveis-select'],
      })
    },
  })
}

export const useDeleteMultipleCombustiveis = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      CombustiveisService('combustivel').deleteMultipleCombustiveis(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['combustiveis-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['combustiveis'] })
      queryClient.invalidateQueries({
        queryKey: ['combustiveis-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['combustiveis-select'],
      })
    },
  })
}

export const useCreateCombustivel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCombustivelDTO) =>
      CombustiveisService('combustivel').createCombustivel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['combustiveis-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['combustiveis'] })
      queryClient.invalidateQueries({
        queryKey: ['combustiveis-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['combustiveis-select'],
      })
    },
  })
}

export const useUpdateCombustivel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCombustivelDTO }) =>
      CombustiveisService('combustivel').updateCombustivel(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['combustiveis-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['combustiveis'] })
      queryClient.invalidateQueries({
        queryKey: ['combustiveis-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['combustiveis-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['combustivel', id],
      })
    },
  })
}
