import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateEntidadeDTO,
  UpdateEntidadeDTO,
} from '@/types/dtos/base/entidades.dtos'
import { EntidadesService } from '@/lib/services/base/entidades-service'

export const useDeleteEntidade = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      EntidadesService('entidades').deleteEntidade(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['entidades-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['entidades'] })
      queryClient.invalidateQueries({ queryKey: ['entidades-count'] })
      queryClient.invalidateQueries({ queryKey: ['entidades-select'] })
      queryClient.invalidateQueries({ queryKey: ['entidade', id] })
    },
  })
}

export const useCreateEntidade = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateEntidadeDTO) =>
      EntidadesService('entidades').createEntidade(data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['entidades-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['entidades'] })
      queryClient.invalidateQueries({ queryKey: ['entidades-count'] })
      queryClient.invalidateQueries({ queryKey: ['entidades-select'] })
    },
  })
}

export const useUpdateEntidade = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEntidadeDTO }) =>
      EntidadesService('entidades').updateEntidade(id, { ...data, id }),
    onSuccess: async (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['entidades-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['entidades'] })
      queryClient.invalidateQueries({ queryKey: ['entidades-count'] })
      queryClient.invalidateQueries({ queryKey: ['entidades-select'] })
      queryClient.invalidateQueries({ queryKey: ['entidade', id] })
    },
  })
}

export const useDeleteMultipleEntidades = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      EntidadesService('entidades').deleteMultipleEntidades(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['entidades-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['entidades'] })
      queryClient.invalidateQueries({ queryKey: ['entidades-count'] })
      queryClient.invalidateQueries({ queryKey: ['entidades-select'] })
      // Invalidate individual entidade queries for all deleted IDs
      ids.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: ['entidade', id] })
      })
    },
  })
}
