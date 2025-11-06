import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateConservatoriaDTO,
  UpdateConservatoriaDTO,
} from '@/types/dtos/base/conservatorias.dtos'
import { ConservatoriasService } from '@/lib/services/base/conservatorias-service'

export const useDeleteConservatoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      ConservatoriasService('conservatorias').deleteConservatoria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conservatorias-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['conservatorias'] })
      queryClient.invalidateQueries({ queryKey: ['conservatorias-count'] })
      queryClient.invalidateQueries({ queryKey: ['conservatorias-select'] })
    },
  })
}

export const useCreateConservatoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateConservatoriaDTO) =>
      ConservatoriasService('conservatorias').createConservatoria(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conservatorias-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['conservatorias'] })
      queryClient.invalidateQueries({ queryKey: ['conservatorias-count'] })
      queryClient.invalidateQueries({ queryKey: ['conservatorias-select'] })
    },
  })
}

export const useUpdateConservatoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConservatoriaDTO }) =>
      ConservatoriasService('conservatorias').updateConservatoria(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['conservatorias-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['conservatorias'] })
      queryClient.invalidateQueries({ queryKey: ['conservatorias-count'] })
      queryClient.invalidateQueries({ queryKey: ['conservatorias-select'] })
      queryClient.invalidateQueries({ queryKey: ['conservatorias', id] })
    },
  })
}

export const useDeleteMultipleConservatorias = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      ConservatoriasService('conservatorias').deleteMultipleConservatorias(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conservatorias-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['conservatorias'] })
      queryClient.invalidateQueries({ queryKey: ['conservatorias-count'] })
      queryClient.invalidateQueries({ queryKey: ['conservatorias-select'] })
    },
  })
}

