import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateCodigoPostalDTO,
  UpdateCodigoPostalDTO,
} from '@/types/dtos/base/codigospostais.dtos'
import { CodigosPostaisService } from '@/lib/services/base/codigospostais-service'

export const useDeleteCodigoPostal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      CodigosPostaisService('codigospostais').deleteCodigoPostal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['codigospostais-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['codigospostais'] })
      queryClient.invalidateQueries({ queryKey: ['codigospostais-count'] })
      queryClient.invalidateQueries({ queryKey: ['codigospostais-select'] })
    },
  })
}

export const useCreateCodigoPostal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCodigoPostalDTO) =>
      CodigosPostaisService('codigospostais').createCodigoPostal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['codigospostais-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['codigospostais'] })
      queryClient.invalidateQueries({ queryKey: ['codigospostais-count'] })
      queryClient.invalidateQueries({ queryKey: ['codigospostais-select'] })
    },
  })
}

export const useUpdateCodigoPostal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCodigoPostalDTO }) =>
      CodigosPostaisService('codigospostais').updateCodigoPostal(id, {
        ...data,
        id,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['codigospostais-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['codigospostais'] })
      queryClient.invalidateQueries({ queryKey: ['codigospostais-count'] })
      queryClient.invalidateQueries({ queryKey: ['codigospostais-select'] })
      queryClient.invalidateQueries({ queryKey: ['codigoPostal', id] })
    },
  })
}

export const useDeleteMultipleCodigosPostais = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      CodigosPostaisService('codigospostais').deleteMultipleCodigosPostais(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['codigospostais-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['codigospostais'] })
      queryClient.invalidateQueries({ queryKey: ['codigospostais-count'] })
      queryClient.invalidateQueries({ queryKey: ['codigospostais-select'] })
    },
  })
}
