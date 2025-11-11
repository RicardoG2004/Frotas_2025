import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateCorDTO,
  UpdateCorDTO,
} from '@/types/dtos/frotas/cores.dtos'
import { CoresService } from '@/lib/services/frotas/cores-service'

export const useDeleteCor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      CoresService('cores').deleteCor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['cores'] })
      queryClient.invalidateQueries({ queryKey: ['cores-count'] })
      queryClient.invalidateQueries({ queryKey: ['cores-select'] })
    },
  })
}

export const useCreateCor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCorDTO) =>
      CoresService('cores').createCor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['cores'] })
      queryClient.invalidateQueries({ queryKey: ['cores-count'] })
      queryClient.invalidateQueries({ queryKey: ['cores-select'] })
    },
  })
}

export const useUpdateCor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCorDTO }) =>
      CoresService('cores').updateCor(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['cores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['cores'] })
      queryClient.invalidateQueries({ queryKey: ['cores-count'] })
      queryClient.invalidateQueries({ queryKey: ['cores-select'] })
      queryClient.invalidateQueries({ queryKey: ['cor', id] })
    },
  })
}

export const useDeleteMultipleCores = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      CoresService('cores').deleteMultipleCores(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['cores'] })
      queryClient.invalidateQueries({ queryKey: ['cores-count'] })
      queryClient.invalidateQueries({ queryKey: ['cores-select'] })
    },
  })
}

