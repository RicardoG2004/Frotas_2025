import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateProprietarioDTO,
  UpdateProprietarioDTO,
} from '@/types/dtos/cemiterios/proprietarios.dtos'
import { ProprietariosService } from '@/lib/services/cemiterios/proprietarios-service'

export const useDeleteProprietario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      ProprietariosService('proprietario').deleteProprietario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['proprietarios'] })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['sepulturas'] })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-select'],
      })
    },
  })
}

export const useDeleteMultipleProprietarios = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      ProprietariosService('proprietario').deleteMultipleProprietarios(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['proprietarios'] })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['sepulturas'] })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-select'],
      })

      // Invalidate all individual sepultura queries to ensure updated proprietario info is shown
      queryClient.invalidateQueries({
        queryKey: ['sepultura'],
        exact: false,
      })
    },
  })
}

export const useCreateProprietario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateProprietarioDTO) =>
      ProprietariosService('proprietario').createProprietario(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['proprietarios'] })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['sepulturas'] })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-select'],
      })

      // Invalidate individual sepultura queries for each sepultura in the request
      if (variables.sepulturas) {
        variables.sepulturas.forEach((sepultura) => {
          if (sepultura.sepulturaId) {
            queryClient.invalidateQueries({
              queryKey: ['sepultura', sepultura.sepulturaId],
            })
          }
        })
      }
    },
  })
}

export const useUpdateProprietario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProprietarioDTO }) =>
      ProprietariosService('proprietario').updateProprietario(id, {
        ...data,
        id,
      }),
    onSuccess: (_, { id, data }) => {
      // Get the original proprietario data from cache to identify removed sepulturas
      const originalData = queryClient.getQueryData(['proprietario', id]) as any
      const originalSepulturas = originalData?.info?.data?.sepulturas || []
      const newSepulturas = data.sepulturas || []

      // Find sepulturas that were removed
      const removedSepulturas = originalSepulturas.filter(
        (originalSepultura: any) =>
          !newSepulturas.some(
            (newSepultura) =>
              newSepultura.sepulturaId === originalSepultura.sepulturaId
          )
      )

      queryClient.invalidateQueries({
        queryKey: ['proprietarios-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['proprietarios'] })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['proprietarios-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['proprietario', id],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-paginated'],
      })
      queryClient.invalidateQueries({ queryKey: ['sepulturas'] })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-select'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-paginated'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sepulturas-proprietarios-select'],
      })

      // Invalidate AND refetch ALL sepulturas that were associated with this proprietario (both removed and remaining)
      // This ensures the sepultura pages show the updated proprietor information
      const allAffectedSepulturas = [
        ...removedSepulturas.map((s: any) => s.sepulturaId),
        ...(data.sepulturas || []).map((s) => s.sepulturaId),
      ].filter(Boolean)

      allAffectedSepulturas.forEach((sepulturaId) => {
        queryClient.invalidateQueries({
          queryKey: ['sepultura', sepulturaId],
        })
        // Force refetch immediately since the query has refetchOnMount: false
        queryClient.refetchQueries({
          queryKey: ['sepultura', sepulturaId],
        })
      })
    },
  })
}
