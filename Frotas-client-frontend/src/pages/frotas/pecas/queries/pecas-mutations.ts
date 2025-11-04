import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreatePecaDTO,
  UpdatePecaDTO,
} from '@/types/dtos/frotas/pecas.dtos'
import { PecasService } from '@/lib/services/frotas/pecas-service'

export const useDeletePeca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      PecasService('peca').deletePeca(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pecas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['pecas'] })
      queryClient.invalidateQueries({
        queryKey: ['pecas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['pecas-select'],
      })
    },
  })
}

export const useDeleteMultiplePecas = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      PecasService(
        'peca'
      ).deleteMultiplePecas(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pecas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['pecas'] })
      queryClient.invalidateQueries({
        queryKey: ['pecas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['pecas-select'],
      })
    },
  })
}

export const useCreatePeca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreatePecaDTO) =>
      PecasService('peca').createPeca(
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pecas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['pecas'] })
      queryClient.invalidateQueries({
        queryKey: ['pecas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['pecas-select'],
      })
    },
  })
}

export const useUpdatePeca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdatePecaDTO
    }) =>
      PecasService('peca').updatePeca(
        id,
        data
      ),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['pecas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['pecas'] })
      queryClient.invalidateQueries({
        queryKey: ['pecas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['pecas-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['peca', id],
      })
    },
  })
}

