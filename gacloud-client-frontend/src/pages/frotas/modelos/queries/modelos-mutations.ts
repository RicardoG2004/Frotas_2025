import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateModeloDTO,
  UpdateModeloDTO,
} from '@/types/dtos/frotas/coveiros.dtos'
import { ModelosService } from '@/lib/services/frotas/modelos-service'

export const useDeleteModelo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ModelosService('modelo').deleteModelo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['modelos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['modelos'] })
      queryClient.invalidateQueries({
        queryKey: ['modelos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['modelos-select'],
      })
    },
  })
}

export const useDeleteMultipleModelos = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      ModelosService('modelo').deleteMultipleModelos(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['modelos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['modelos'] })
      queryClient.invalidateQueries({
        queryKey: ['modelos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['modelos-select'],
      })
    },
  })
}

export const useCreateModelo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateModeloDTO) =>
      ModelosService('modelo').createModelo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['modelos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['modelos'] })
      queryClient.invalidateQueries({
        queryKey: ['modelos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['modelos-select'],
      })
    },
  })
}

export const useUpdateModelo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateModeloDTO }) =>
      ModelosService('modelo').updateModelo(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['modelos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['modelos'] })
      queryClient.invalidateQueries({
        queryKey: ['modelos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['modelos-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['modelo', id],
      })
    },
  })
}
