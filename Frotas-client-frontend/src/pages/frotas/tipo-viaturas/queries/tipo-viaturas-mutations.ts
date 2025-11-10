import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateTipoViaturaDTO,
  UpdateTipoViaturaDTO,
} from '@/types/dtos/frotas/tipo-viaturas.dtos'
import { TipoViaturasService } from '@/lib/services/frotas/tipo-viaturas-service'

export const useDeleteTipoViatura = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      TipoViaturasService('tipoViatura').deleteTipoViatura(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tipo-viaturas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['tipo-viaturas'] })
      queryClient.invalidateQueries({
        queryKey: ['tipo-viaturas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['tipo-viaturas-select'],
      })
    },
  })
}

export const useDeleteMultipleTipoViaturas = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      TipoViaturasService('tipoViatura').deleteMultipleTipoViaturas(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tipo-viaturas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['tipo-viaturas'] })
      queryClient.invalidateQueries({
        queryKey: ['tipo-viaturas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['tipo-viaturas-select'],
      })
    },
  })
}

export const useCreateTipoViatura = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTipoViaturaDTO) =>
      TipoViaturasService('tipoViatura').createTipoViatura(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tipo-viaturas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['tipo-viaturas'] })
      queryClient.invalidateQueries({
        queryKey: ['tipo-viaturas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['tipo-viaturas-select'],
      })
    },
  })
}

export const useUpdateTipoViatura = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTipoViaturaDTO }) =>
      TipoViaturasService('tipoViatura').updateTipoViatura(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['tipo-viaturas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['tipo-viaturas'] })
      queryClient.invalidateQueries({
        queryKey: ['tipo-viaturas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['tipo-viaturas-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['tipo-viatura', id],
      })
    },
  })
}

