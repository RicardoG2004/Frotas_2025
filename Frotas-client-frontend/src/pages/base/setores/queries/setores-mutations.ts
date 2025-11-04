import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateSetorDTO,
  UpdateSetorDTO,
} from '@/types/dtos/base/setores.dtos'
import { SetoresService } from '@/lib/services/base/setores-service'

export const useDeleteSetor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      SetoresService('setores').deleteSetor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['setores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['setores'] })
      queryClient.invalidateQueries({ queryKey: ['setores-count'] })
      queryClient.invalidateQueries({ queryKey: ['setores-select'] })
    },
  })
}

export const useCreateSetor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateSetorDTO) =>
      SetoresService('setores').createSetor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['setores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['setores'] })
      queryClient.invalidateQueries({ queryKey: ['setores-count'] })
      queryClient.invalidateQueries({ queryKey: ['setores-select'] })
    },
  })
}

export const useUpdateSetor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSetorDTO }) =>
      SetoresService('setores').updateSetor(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['setores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['setores'] })
      queryClient.invalidateQueries({ queryKey: ['setores-count'] })
      queryClient.invalidateQueries({ queryKey: ['setores-select'] })
      queryClient.invalidateQueries({ queryKey: ['setores', id] })
    },
  })
}

export const useDeleteMultipleSetores = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      SetoresService('setores').deleteMultipleSetores(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['setores-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['setores'] })
      queryClient.invalidateQueries({ queryKey: ['setores-count'] })
      queryClient.invalidateQueries({ queryKey: ['setores-select'] })
    },
  })
}

