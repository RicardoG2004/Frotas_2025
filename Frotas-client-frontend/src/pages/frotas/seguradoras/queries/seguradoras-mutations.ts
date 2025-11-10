import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateSeguradoraDTO,
  UpdateSeguradoraDTO,
} from '@/types/dtos/frotas/seguradoras.dtos'
import { SeguradorasService } from '@/lib/services/frotas/seguradoras-service'

export const useDeleteSeguradora = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      SeguradorasService('seguradora').deleteSeguradora(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['seguradoras-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['seguradoras'] })
      queryClient.invalidateQueries({
        queryKey: ['seguradoras-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['seguradoras-select'],
      })
    },
  })
}

export const useDeleteMultipleSeguradoras = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      SeguradorasService('seguradora').deleteMultipleSeguradoras(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['seguradoras-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['seguradoras'] })
      queryClient.invalidateQueries({
        queryKey: ['seguradoras-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['seguradoras-select'],
      })
    },
  })
}

export const useCreateSeguradora = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateSeguradoraDTO) =>
      SeguradorasService('seguradora').createSeguradora(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['seguradoras-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['seguradoras'] })
      queryClient.invalidateQueries({
        queryKey: ['seguradoras-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['seguradoras-select'],
      })
    },
  })
}

export const useUpdateSeguradora = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSeguradoraDTO }) =>
      SeguradorasService('seguradora').updateSeguradora(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['seguradoras-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['seguradoras'] })
      queryClient.invalidateQueries({
        queryKey: ['seguradoras-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['seguradoras-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['seguradora', id],
      })
    },
  })
}


