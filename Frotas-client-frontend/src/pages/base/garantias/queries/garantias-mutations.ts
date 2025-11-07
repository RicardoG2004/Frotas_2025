import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateGarantiaDTO,
  UpdateGarantiaDTO,
} from '@/types/dtos/base/garantias.dtos'
import { GarantiasService } from '@/lib/services/base/garantias-service'

export const useDeleteGarantia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => GarantiasService('garantias').deleteGarantia(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['garantias-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['garantias'] })
      queryClient.invalidateQueries({ queryKey: ['garantias-count'] })
      queryClient.invalidateQueries({ queryKey: ['garantias-select'] })
      queryClient.invalidateQueries({ queryKey: ['garantia', id] })
    },
  })
}

export const useCreateGarantia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateGarantiaDTO) =>
      GarantiasService('garantias').createGarantia(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garantias-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['garantias'] })
      queryClient.invalidateQueries({ queryKey: ['garantias-count'] })
      queryClient.invalidateQueries({ queryKey: ['garantias-select'] })
    },
  })
}

export const useUpdateGarantia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGarantiaDTO }) =>
      GarantiasService('garantias').updateGarantia(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['garantias-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['garantias'] })
      queryClient.invalidateQueries({ queryKey: ['garantias-count'] })
      queryClient.invalidateQueries({ queryKey: ['garantias-select'] })
      queryClient.invalidateQueries({ queryKey: ['garantia', id] })
    },
  })
}

export const useDeleteMultipleGarantias = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      GarantiasService('garantias').deleteMultipleGarantias(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garantias-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['garantias'] })
      queryClient.invalidateQueries({ queryKey: ['garantias-count'] })
      queryClient.invalidateQueries({ queryKey: ['garantias-select'] })
    },
  })
}


