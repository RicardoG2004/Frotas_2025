import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PaginatedRequest } from '@/types/api/responses'
import { useAuthStore } from '@/stores/auth-store'
import { SepulturasTiposService } from '@/lib/services/cemiterios/sepulturas-tipos-service'

interface SepulturasTiposPaginatedRequest extends PaginatedRequest {
  epocaId?: string
}

export const useGetSepulturasTiposPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useQuery({
    queryKey: [
      'sepulturas-tipos-paginated',
      { pageNumber, pageLimit, filters, sorting },
      selectedEpoca?.id,
    ],
    queryFn: () =>
      SepulturasTiposService('sepulturas-tipos').getSepulturasTiposPaginated({
        pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting: sorting ?? undefined,
        epocaId: selectedEpoca?.id,
      } as SepulturasTiposPaginatedRequest),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentSepulturasTipos = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'sepulturas-tipos-paginated',
          page - 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          SepulturasTiposService(
            'sepulturas-tipos'
          ).getSepulturasTiposPaginated({
            pageNumber: page - 1,
            pageSize: pageSize,
            filters:
              (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined,
          }),
      })
    }
  }

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: [
        'sepulturas-tipos-paginated',
        page + 1,
        pageSize,
        filters,
        null,
      ],
      queryFn: () =>
        SepulturasTiposService('sepulturas-tipos').getSepulturasTiposPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetSepulturasTipos = () => {
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useQuery({
    queryKey: ['sepulturas-tipos', selectedEpoca?.id],
    queryFn: () =>
      SepulturasTiposService('sepulturas-tipos').getSepulturasTipos(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetSepulturaTipo = (id: string) => {
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useQuery({
    queryKey: ['sepultura-tipo', id, selectedEpoca?.id],
    queryFn: () =>
      SepulturasTiposService('sepulturas-tipos').getSepulturaTipo(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetSepulturasTiposCount = () => {
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useQuery({
    queryKey: ['sepulturas-tipos-count', selectedEpoca?.id],
    queryFn: async () => {
      const response =
        await SepulturasTiposService('sepulturas-tipos').getSepulturasTipos()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetSepulturasTiposSelect = () => {
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)

  return useQuery({
    queryKey: ['sepulturas-tipos-select', selectedEpoca?.id],
    queryFn: async () => {
      const response =
        await SepulturasTiposService('sepulturas-tipos').getSepulturasTipos()
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}
