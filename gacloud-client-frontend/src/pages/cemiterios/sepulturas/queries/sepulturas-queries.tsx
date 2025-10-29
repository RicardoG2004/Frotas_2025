import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SepulturasService } from '@/lib/services/cemiterios/sepulturas-service'

export const useGetSepulturasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['sepulturas-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      SepulturasService('sepulturas').getSepulturasPaginated({
        pageNumber: pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting: sorting ?? undefined,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentSepulturas = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['sepulturas-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          SepulturasService('sepulturas').getSepulturasPaginated({
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
      queryKey: ['sepulturas-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        SepulturasService('sepulturas').getSepulturasPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetSepulturas = () => {
  return useQuery({
    queryKey: ['sepulturas'],
    queryFn: () => SepulturasService('sepulturas').getSepulturas(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetSepultura = (id: string) => {
  return useQuery({
    queryKey: ['sepultura', id],
    queryFn: () => SepulturasService('sepulturas').getSepultura(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 10 * 60 * 1000, // Increased to 10 minutes
    gcTime: 60 * 60 * 1000, // Increased to 1 hour
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: false, // Use cached data when available
    retry: 1, // Reduce retry attempts for faster failure
    retryDelay: 1000, // Faster retry delay
  })
}

export const useGetSepulturasCount = () => {
  return useQuery({
    queryKey: ['sepulturas-count'],
    queryFn: async () => {
      const response = await SepulturasService('sepulturas').getSepulturas()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetSepulturasSelect = () => {
  return useQuery({
    queryKey: ['sepulturas-select'],
    queryFn: async () => {
      const response = await SepulturasService('sepulturas').getSepulturas()
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}
