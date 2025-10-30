import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateFreguesiaDTO,
  UpdateFreguesiaDTO,
} from '@/types/dtos/base/freguesias.dtos'
import { FreguesiasService } from '@/lib/services/base/freguesias-service'

export const useDeleteFreguesia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      FreguesiasService('freguesias').deleteFreguesia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freguesias-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['freguesias'] })
      queryClient.invalidateQueries({ queryKey: ['freguesias-count'] })
      queryClient.invalidateQueries({ queryKey: ['freguesias-select'] })
    },
  })
}

export const useCreateFreguesia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateFreguesiaDTO) =>
      FreguesiasService('freguesias').createFreguesia(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freguesias-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['freguesias'] })
      queryClient.invalidateQueries({ queryKey: ['freguesias-count'] })
      queryClient.invalidateQueries({ queryKey: ['freguesias-select'] })
    },
  })
}

export const useUpdateFreguesia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFreguesiaDTO }) =>
      FreguesiasService('freguesias').updateFreguesia(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['freguesias-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['freguesias'] })
      queryClient.invalidateQueries({ queryKey: ['freguesias-count'] })
      queryClient.invalidateQueries({ queryKey: ['freguesias-select'] })
      queryClient.invalidateQueries({ queryKey: ['freguesia', id] })
    },
  })
}

export const useDeleteMultipleFreguesias = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      FreguesiasService('freguesias').deleteMultipleFreguesias(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freguesias-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['freguesias'] })
      queryClient.invalidateQueries({ queryKey: ['freguesias-count'] })
      queryClient.invalidateQueries({ queryKey: ['freguesias-select'] })
    },
  })
}
