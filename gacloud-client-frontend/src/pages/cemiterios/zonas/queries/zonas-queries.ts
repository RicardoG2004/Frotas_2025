import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PaginatedRequest } from '@/types/api/responses'
import { useAuthStore } from '@/stores/auth-store'
import { ZonasService } from '@/lib/services/cemiterios/zonas-service'

interface ZonasPaginatedRequest extends PaginatedRequest {
  cemiterioId?: string
}

export const useGetZonasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  const selectedCemiterio = useAuthStore((state) => state.selectedCemiterio)

  return useQuery({
    queryKey: [
      'zonas-paginated',
      { pageNumber, pageLimit, filters, sorting },
      selectedCemiterio?.id,
    ],
    queryFn: () =>
      ZonasService('zonas').getZonasPaginated({
        pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting: sorting ?? undefined,
        cemiterioId: selectedCemiterio?.id,
      } as ZonasPaginatedRequest),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentZonas = (
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
          'zonas-paginated',
          { pageNumber: page - 1, pageLimit: pageSize, filters, sorting: null },
          selectedCemiterio?.id,
        ],
        queryFn: () =>
          ZonasService('zonas').getZonasPaginated({
            pageNumber: page - 1,
            pageSize,
            filters:
              (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined,
            cemiterioId: selectedCemiterio?.id,
          } as ZonasPaginatedRequest),
      })
    }
  }

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: [
        'zonas-paginated',
        { pageNumber: page + 1, pageLimit: pageSize, filters, sorting: null },
        selectedCemiterio?.id,
      ],
      queryFn: () =>
        ZonasService('zonas').getZonasPaginated({
          pageNumber: page + 1,
          pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
          cemiterioId: selectedCemiterio?.id,
        } as ZonasPaginatedRequest),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetZonas = () => {
  const selectedCemiterio = useAuthStore((state) => state.selectedCemiterio)

  return useQuery({
    queryKey: ['zonas', selectedCemiterio?.id],
    queryFn: () => ZonasService('zonas').getZonas(selectedCemiterio?.id),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetZona = (id: string) => {
  const selectedCemiterio = useAuthStore((state) => state.selectedCemiterio)

  return useQuery({
    queryKey: ['zona', id, selectedCemiterio?.id],
    queryFn: () => ZonasService('zonas').getZona(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetZonasCount = () => {
  const selectedCemiterio = useAuthStore((state) => state.selectedCemiterio)

  return useQuery({
    queryKey: ['cemiterios-zonas-count', selectedCemiterio?.id],
    queryFn: async () => {
      const response = await ZonasService('zonas').getZonas(
        selectedCemiterio?.id
      )
      return response.info?.data?.length || 0
    },
  })
}

export const useGetZonasSelect = () => {
  const selectedCemiterio = useAuthStore((state) => state.selectedCemiterio)

  return useQuery({
    queryKey: ['cemiterios-zonas-select', selectedCemiterio?.id],
    queryFn: async () => {
      const response = await ZonasService('zonas').getZonas(
        selectedCemiterio?.id
      )
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}
