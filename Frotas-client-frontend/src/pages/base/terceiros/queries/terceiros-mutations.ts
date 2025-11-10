import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateTerceiroDTO,
  UpdateTerceiroDTO,
} from '@/types/dtos/base/terceiros.dtos'
import { TerceirosService } from '@/lib/services/base/terceiros-service'

export const useDeleteTerceiro = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      TerceirosService('terceiros').deleteTerceiro(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terceiros-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['terceiros'] })
      queryClient.invalidateQueries({ queryKey: ['terceiros-count'] })
    },
  })
}

export const useCreateTerceiro = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTerceiroDTO) =>
      TerceirosService('terceiros').createTerceiro(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terceiros-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['terceiros'] })
      queryClient.invalidateQueries({ queryKey: ['terceiros-count'] })
    },
  })
}

export const useUpdateTerceiro = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTerceiroDTO }) =>
      TerceirosService('terceiros').updateTerceiro(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['terceiros-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['terceiros'] })
      queryClient.invalidateQueries({ queryKey: ['terceiros-count'] })
      queryClient.invalidateQueries({ queryKey: ['terceiros', id] })
    },
  })
}

export const useDeleteMultipleTerceiros = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      TerceirosService('terceiros').deleteMultipleTerceiros(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terceiros-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['terceiros'] })
      queryClient.invalidateQueries({ queryKey: ['terceiros-count'] })
    },
  })
}


