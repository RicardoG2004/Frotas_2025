import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ResponseStatus } from '@/types/api/responses'
import { CreateEpocaDTO, UpdateEpocaDTO } from '@/types/dtos/base/epocas.dtos'
import { EpocasService } from '@/lib/services/base/epocas-service'
import { useEpocaPredefined } from '@/hooks/use-epoca-predefined'

export const useDeleteEpoca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => EpocasService('epocas').deleteEpoca(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['epocas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['epocas'] })
      queryClient.invalidateQueries({ queryKey: ['epocas-count'] })
      queryClient.invalidateQueries({ queryKey: ['epocas-select'] })
    },
  })
}

export const useCreateEpoca = () => {
  const queryClient = useQueryClient()
  const { updatePredefinedEpoca } = useEpocaPredefined()

  return useMutation({
    mutationFn: async (data: CreateEpocaDTO) =>
      EpocasService('epocas').createEpoca(data),
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({ queryKey: ['epocas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['epocas'] })
      queryClient.invalidateQueries({ queryKey: ['epocas-count'] })
      queryClient.invalidateQueries({ queryKey: ['epocas-select'] })

      if (response.info.status === ResponseStatus.Success && data.predefinida) {
        await updatePredefinedEpoca()
      }
    },
  })
}

export const useUpdateEpoca = () => {
  const queryClient = useQueryClient()
  const { updatePredefinedEpoca } = useEpocaPredefined()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEpocaDTO }) =>
      EpocasService('epocas').updateEpoca(id, { ...data, id }),
    onSuccess: async (response, { data }) => {
      queryClient.invalidateQueries({ queryKey: ['epocas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['epocas'] })
      queryClient.invalidateQueries({ queryKey: ['epocas-count'] })
      queryClient.invalidateQueries({ queryKey: ['epocas-select'] })

      if (response.info.status === ResponseStatus.Success && data.predefinida) {
        await updatePredefinedEpoca()
      }
    },
  })
}

export const useDeleteMultipleEpocas = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      EpocasService('epocas').deleteMultipleEpocas(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['epocas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['epocas'] })
      queryClient.invalidateQueries({ queryKey: ['epocas-count'] })
      queryClient.invalidateQueries({ queryKey: ['epocas-select'] })
    },
  })
}
