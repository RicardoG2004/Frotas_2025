import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PaginatedRequest } from '@/types/api/responses'
import { useAuthStore } from '@/stores/auth-store'
import { TalhoesService } from '@/lib/services/cemiterios/talhoes-service'

interface TalhoesPaginatedRequest extends PaginatedRequest {
  cemiterioId?: string
}

export const useGetTalhoesPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  const selectedCemiterio = useAuthStore((state) => state.selectedCemiterio)
  return useQuery({
    queryKey: [
      'talhoes-paginated',
      { pageNumber, pageLimit, filters, sorting },
      selectedCemiterio?.id,
    ],
    queryFn: () =>
      TalhoesService('talhoes').getTalhoesPaginated({
        pageNumber: pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting: sorting ?? undefined,
        cemiterioId: selectedCemiterio?.id,
      } as TalhoesPaginatedRequest),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentTalhoes = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()
  const selectedCemiterio = useAuthStore((state) => state.selectedCemiterio)

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'talhoes-paginated',
          { pageNumber: page - 1, pageLimit: pageSize, filters, sorting: null },
          selectedCemiterio?.id,
        ],
        queryFn: () =>
          TalhoesService('talhoes').getTalhoesPaginated({
            pageNumber: page - 1,
            pageSize: pageSize,
            filters:
              (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined,
            cemiterioId: selectedCemiterio?.id,
          } as TalhoesPaginatedRequest),
      })
    }
  }

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: [
        'talhoes-paginated',
        { pageNumber: page + 1, pageLimit: pageSize, filters, sorting: null },
        selectedCemiterio?.id,
      ],
      queryFn: () =>
        TalhoesService('talhoes').getTalhoesPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
          cemiterioId: selectedCemiterio?.id,
        } as TalhoesPaginatedRequest),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetTalhoes = () => {
  const selectedCemiterio = useAuthStore((state) => state.selectedCemiterio)
  return useQuery({
    queryKey: ['talhoes', selectedCemiterio?.id],
    queryFn: () => TalhoesService('talhoes').getTalhoes(selectedCemiterio?.id),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetTalhao = (id: string) => {
  const selectedCemiterio = useAuthStore((state) => state.selectedCemiterio)
  return useQuery({
    queryKey: ['talhao', id, selectedCemiterio?.id],
    queryFn: () => TalhoesService('talhoes').getTalhao(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetTalhoesCount = () => {
  const selectedCemiterio = useAuthStore((state) => state.selectedCemiterio)
  return useQuery({
    queryKey: ['talhoes-count', selectedCemiterio?.id],
    queryFn: async () => {
      const response = await TalhoesService('talhoes').getTalhoes(
        selectedCemiterio?.id
      )
      return response.info?.data?.length || 0
    },
  })
}

export const useGetTalhoesSelect = () => {
  const selectedCemiterio = useAuthStore((state) => state.selectedCemiterio)
  return useQuery({
    queryKey: ['talhoes-select', selectedCemiterio?.id],
    queryFn: async () => {
      const response = await TalhoesService('talhoes').getTalhoes(
        selectedCemiterio?.id
      )
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}
