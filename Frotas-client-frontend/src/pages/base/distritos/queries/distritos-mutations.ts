import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateDistritoDTO,
  UpdateDistritoDTO,
} from '@/types/dtos/base/distritos.dtos'
import { DistritosService } from '@/lib/services/base/distritos-service'

export const useDeleteDistrito = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      DistritosService('distritos').deleteDistrito(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distritos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['distritos'] })
      queryClient.invalidateQueries({ queryKey: ['distritos-count'] })
      queryClient.invalidateQueries({ queryKey: ['distritos-select'] })
    },
  })
}

export const useCreateDistrito = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateDistritoDTO) =>
      DistritosService('distritos').createDistrito(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distritos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['distritos'] })
      queryClient.invalidateQueries({ queryKey: ['distritos-count'] })
      queryClient.invalidateQueries({ queryKey: ['distritos-select'] })
    },
  })
}

export const useUpdateDistrito = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDistritoDTO }) =>
      DistritosService('distritos').updateDistrito(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['distritos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['distritos'] })
      queryClient.invalidateQueries({ queryKey: ['distritos-count'] })
      queryClient.invalidateQueries({ queryKey: ['distritos-select'] })
      queryClient.invalidateQueries({ queryKey: ['distrito', id] })
    },
  })
}

export const useDeleteMultipleDistritos = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      DistritosService('distritos').deleteMultipleDistritos(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distritos-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['distritos'] })
      queryClient.invalidateQueries({ queryKey: ['distritos-count'] })
      queryClient.invalidateQueries({ queryKey: ['distritos-select'] })
    },
  })
}
