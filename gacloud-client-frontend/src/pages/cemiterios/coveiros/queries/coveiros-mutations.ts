import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateCoveiroDTO,
  UpdateCoveiroDTO,
} from '@/types/dtos/cemiterios/coveiros.dtos'
import { CoveirosService } from '@/lib/services/cemiterios/coveiros-service'

export const useDeleteCoveiro = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => CoveirosService('coveiro').deleteCoveiro(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['coveiros-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['coveiros'] })
      queryClient.invalidateQueries({
        queryKey: ['coveiros-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['coveiros-select'],
      })
    },
  })
}

export const useDeleteMultipleCoveiros = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      CoveirosService('coveiro').deleteMultipleCoveiros(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['coveiros-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['coveiros'] })
      queryClient.invalidateQueries({
        queryKey: ['coveiros-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['coveiros-select'],
      })
    },
  })
}

export const useCreateCoveiro = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCoveiroDTO) =>
      CoveirosService('coveiro').createCoveiro(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['coveiros-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['coveiros'] })
      queryClient.invalidateQueries({
        queryKey: ['coveiros-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['coveiros-select'],
      })
    },
  })
}

export const useUpdateCoveiro = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCoveiroDTO }) =>
      CoveirosService('coveiro').updateCoveiro(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['coveiros-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['coveiros'] })
      queryClient.invalidateQueries({
        queryKey: ['coveiros-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['coveiros-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['coveiro', id],
      })
    },
  })
}
