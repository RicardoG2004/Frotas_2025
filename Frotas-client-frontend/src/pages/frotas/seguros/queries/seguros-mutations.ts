import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateSeguroDTO,
  UpdateSeguroDTO,
} from '@/types/dtos/frotas/seguros.dtos'
import { SegurosService } from '@/lib/services/frotas/seguros-service'

export const useDeleteSeguro = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => SegurosService('seguro').deleteSeguro(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seguros-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['seguros'] })
      queryClient.invalidateQueries({ queryKey: ['seguros-count'] })
      queryClient.invalidateQueries({ queryKey: ['seguros-select'] })
    },
  })
}

export const useDeleteMultipleSeguros = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      SegurosService('seguro').deleteMultipleSeguros(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seguros-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['seguros'] })
      queryClient.invalidateQueries({ queryKey: ['seguros-count'] })
      queryClient.invalidateQueries({ queryKey: ['seguros-select'] })
    },
  })
}

export const useCreateSeguro = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateSeguroDTO) =>
      SegurosService('seguro').createSeguro(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seguros-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['seguros'] })
      queryClient.invalidateQueries({ queryKey: ['seguros-count'] })
      queryClient.invalidateQueries({ queryKey: ['seguros-select'] })
    },
  })
}

export const useUpdateSeguro = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSeguroDTO }) =>
      SegurosService('seguro').updateSeguro(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['seguros-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['seguros'] })
      queryClient.invalidateQueries({ queryKey: ['seguros-count'] })
      queryClient.invalidateQueries({ queryKey: ['seguros-select'] })
      queryClient.invalidateQueries({ queryKey: ['seguro', id] })
    },
  })
}


