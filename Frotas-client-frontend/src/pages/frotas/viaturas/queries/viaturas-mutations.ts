import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateViaturaDTO,
  UpdateViaturaDTO,
} from '@/types/dtos/frotas/viaturas.dtos'
import { ViaturasService } from '@/lib/services/frotas/viaturas-service'

const invalidateViaturaQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['viaturas-paginated'] })
  queryClient.invalidateQueries({ queryKey: ['viaturas'] })
  queryClient.invalidateQueries({ queryKey: ['viaturas-count'] })
  queryClient.invalidateQueries({ queryKey: ['viaturas-select'] })
}

export const useDeleteViatura = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ViaturasService('viatura').deleteViatura(id),
    onSuccess: () => {
      invalidateViaturaQueries(queryClient)
    },
  })
}

export const useDeleteMultipleViaturas = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      ViaturasService('viatura').deleteMultipleViaturas(ids),
    onSuccess: () => {
      invalidateViaturaQueries(queryClient)
    },
  })
}

export const useCreateViatura = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateViaturaDTO) =>
      ViaturasService('viatura').createViatura(data),
    onSuccess: () => {
      invalidateViaturaQueries(queryClient)
    },
  })
}

export const useUpdateViatura = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateViaturaDTO }) =>
      ViaturasService('viatura').updateViatura(id, data),
    onSuccess: (_, { id }) => {
      invalidateViaturaQueries(queryClient)
      queryClient.invalidateQueries({ queryKey: ['viatura', id] })
    },
  })
}

