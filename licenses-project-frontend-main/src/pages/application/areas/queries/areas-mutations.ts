import { useQueryClient } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { CreateAreaDTO, UpdateAreaDTO } from '@/types/dtos'
import AreasService from '@/lib/services/application/areas-service'

export const useDeleteArea = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => AreasService('areas').deleteArea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['areas'] })
      queryClient.invalidateQueries({ queryKey: ['areas-count'] })
      queryClient.invalidateQueries({ queryKey: ['areas-select'] })
    },
  })
}

export const useCreateArea = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAreaDTO) => AreasService('areas').createArea(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['areas'] })
      queryClient.invalidateQueries({ queryKey: ['areas-count'] })
      queryClient.invalidateQueries({ queryKey: ['areas-select'] })
    },
  })
}

export const useUpdateArea = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAreaDTO }) =>
      AreasService('areas').updateArea(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['areas'] })
      queryClient.invalidateQueries({ queryKey: ['areas-count'] })
      queryClient.invalidateQueries({ queryKey: ['areas-select'] })
    },
  })
}

export const useDeleteMultipleAreas = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      AreasService('areas').deleteMultipleAreas(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['areas'] })
      queryClient.invalidateQueries({ queryKey: ['areas-count'] })
      queryClient.invalidateQueries({ queryKey: ['areas-select'] })
    },
  })
}
