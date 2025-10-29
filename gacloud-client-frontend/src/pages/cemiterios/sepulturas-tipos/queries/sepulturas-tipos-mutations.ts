import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateSepulturaTipoDTO,
  UpdateSepulturaTipoDTO,
} from '@/types/dtos/cemiterios/sepulturas-tipos.dtos'
import { useAuthStore } from '@/stores/auth-store'
import { SepulturasTiposService } from '@/lib/services/cemiterios/sepulturas-tipos-service'

export const useDeleteSepulturaTipo = () => {
  const queryClient = useQueryClient()
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useMutation({
    mutationFn: (id: string) =>
      SepulturasTiposService('sepulturas-tipos').deleteSepulturaTipo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-count', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-select', selectedEpoca?.id],
      })
    },
  })
}

export const useCreateSepulturaTipo = () => {
  const queryClient = useQueryClient()
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useMutation({
    mutationFn: async (data: CreateSepulturaTipoDTO) =>
      SepulturasTiposService('sepulturas-tipos').createSepulturaTipo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-count', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-select', selectedEpoca?.id],
      })
    },
  })
}

export const useUpdateSepulturaTipo = () => {
  const queryClient = useQueryClient()
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSepulturaTipoDTO }) =>
      SepulturasTiposService('sepulturas-tipos').updateSepulturaTipo(id, {
        ...data,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-count', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-select', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepultura-tipo', variables.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepultura-tipo'],
      })
    },
  })
}

export const useDeleteMultipleSepulturasTipos = () => {
  const queryClient = useQueryClient()
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useMutation({
    mutationFn: (ids: string[]) =>
      SepulturasTiposService('sepulturas-tipos').deleteMultipleSepulturasTipos(
        ids
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-count', selectedEpoca?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-tipos-select', selectedEpoca?.id],
      })
    },
  })
}
