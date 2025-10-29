import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateRubricaDTO,
  UpdateRubricaDTO,
} from '@/types/dtos/base/rubricas.dtos'
import { useAuthStore } from '@/stores/auth-store'
import { RubricasService } from '@/lib/services/base/rubricas-service'

export const useDeleteRubrica = () => {
  const queryClient = useQueryClient()
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useMutation({
    mutationFn: (id: string) => RubricasService('rubricas').deleteRubrica(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rubricas-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['rubricas', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['rubricas-count', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['rubricas-select', selectedEpoca?.id],
      })
    },
  })
}

export const useCreateRubrica = () => {
  const queryClient = useQueryClient()
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useMutation({
    mutationFn: async (data: CreateRubricaDTO) =>
      RubricasService('rubricas').createRubrica(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rubricas-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['rubricas', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['rubricas-count', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['rubricas-select', selectedEpoca?.id],
      })
    },
  })
}

export const useUpdateRubrica = () => {
  const queryClient = useQueryClient()
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRubricaDTO }) =>
      RubricasService('rubricas').updateRubrica(id, { ...data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['rubricas-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['rubricas', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['rubricas-count', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['rubricas-select', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['rubrica', id],
      })
      queryClient.invalidateQueries({
        queryKey: ['rubrica'],
      })
    },
  })
}

export const useDeleteMultipleRubricas = () => {
  const queryClient = useQueryClient()
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useMutation({
    mutationFn: (ids: string[]) =>
      RubricasService('rubricas').deleteMultipleRubricas(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rubricas-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['rubricas', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['rubricas-count', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['rubricas-select', selectedEpoca?.id],
      })
    },
  })
}
