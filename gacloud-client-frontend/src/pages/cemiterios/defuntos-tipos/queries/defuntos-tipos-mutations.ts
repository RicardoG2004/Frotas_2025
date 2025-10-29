import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateDefuntoTipoDTO,
  UpdateDefuntoTipoDTO,
} from '@/types/dtos/cemiterios/defuntos-tipos.dtos'
import { DefuntosTiposService } from '@/lib/services/cemiterios/defuntos-tipos-service'

export const useDeleteDefuntoTipo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      DefuntosTiposService('defunto-tipo').deleteDefuntoTipo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['defuntos-tipos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['defuntos-tipos'] })
      queryClient.invalidateQueries({
        queryKey: ['defuntos-tipos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['defuntos-tipos-select'],
      })
    },
  })
}

export const useCreateDefuntoTipo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateDefuntoTipoDTO) =>
      DefuntosTiposService('defunto-tipo').createDefuntoTipo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['defuntos-tipos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['defuntos-tipos'] })
      queryClient.invalidateQueries({
        queryKey: ['defuntos-tipos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['defuntos-tipos-select'],
      })
    },
  })
}

export const useUpdateDefuntoTipo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDefuntoTipoDTO }) =>
      DefuntosTiposService('defunto-tipo').updateDefuntoTipo(id, {
        ...data,
        id,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['defuntos-tipos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['defuntos-tipos'] })
      queryClient.invalidateQueries({
        queryKey: ['defuntos-tipos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['defuntos-tipos-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['defunto-tipo', id],
      })
    },
  })
}

export const useDeleteMultipleDefuntosTipos = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      DefuntosTiposService('defunto-tipo').deleteMultipleDefuntosTipos(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['defuntos-tipos-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['defuntos-tipos'] })
      queryClient.invalidateQueries({
        queryKey: ['defuntos-tipos-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['defuntos-tipos-select'],
      })
    },
  })
}
