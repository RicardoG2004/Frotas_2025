import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateFseDTO,
  UpdateFseDTO,
} from '@/types/dtos/base/fses.dtos'
import { FsesService } from '@/lib/services/base/fses-service'

export const useDeleteFse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => FsesService('fse').deleteFse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fses-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['fses'] })
      queryClient.invalidateQueries({
        queryKey: ['fses-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['fses-select'],
      })
    },
  })
}

export const useDeleteMultipleFses = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      FsesService('fse').deleteMultipleFses(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fses-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['fses'] })
      queryClient.invalidateQueries({
        queryKey: ['fses-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['fses-select'],
      })
    },
  })
}

export const useCreateFse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateFseDTO) =>
      FsesService('fse').createFse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fses-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['fses'] })
      queryClient.invalidateQueries({
        queryKey: ['fses-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['fses-select'],
      })
    },
  })
}

export const useUpdateFse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFseDTO }) =>
      FsesService('fse').updateFse(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['fses-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['fses'] })
      queryClient.invalidateQueries({
        queryKey: ['fses-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['fses-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['fse', id],
      })
    },
  })
}

