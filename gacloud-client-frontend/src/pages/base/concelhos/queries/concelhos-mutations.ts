import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateConcelhoDTO,
  UpdateConcelhoDTO,
} from '@/types/dtos/base/concelhos.dtos'
import { ConcelhosService } from '@/lib/services/base/concelhos-service'

export const useDeleteConcelho = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      ConcelhosService('concelhos').deleteConcelho(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concelhos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['concelhos'] })
      queryClient.invalidateQueries({ queryKey: ['concelhos-count'] })
      queryClient.invalidateQueries({ queryKey: ['concelhos-select'] })
    },
  })
}

export const useCreateConcelho = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateConcelhoDTO) =>
      ConcelhosService('concelhos').createConcelho(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concelhos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['concelhos'] })
      queryClient.invalidateQueries({ queryKey: ['concelhos-count'] })
      queryClient.invalidateQueries({ queryKey: ['concelhos-select'] })
    },
  })
}

export const useUpdateConcelho = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConcelhoDTO }) =>
      ConcelhosService('concelhos').updateConcelho(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['concelhos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['concelhos'] })
      queryClient.invalidateQueries({ queryKey: ['concelhos-count'] })
      queryClient.invalidateQueries({ queryKey: ['concelhos-select'] })
      queryClient.invalidateQueries({ queryKey: ['concelho', id] })
    },
  })
}

export const useDeleteMultipleConcelhos = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      ConcelhosService('concelhos').deleteMultipleConcelhos(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concelhos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['concelhos'] })
      queryClient.invalidateQueries({ queryKey: ['concelhos-count'] })
      queryClient.invalidateQueries({ queryKey: ['concelhos-select'] })
    },
  })
}
