import { useQuery, useQueryClient } from '@tanstack/react-query'
import { GarantiasService } from '@/lib/services/base/garantias-service'

export const useGetGarantiasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['garantias-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      GarantiasService('garantias').getGarantiasPaginated({
        pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting: sorting ?? undefined,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentGarantias = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['garantias-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          GarantiasService('garantias').getGarantiasPaginated({
            pageNumber: page - 1,
            pageSize,
            filters:
              (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined,
          }),
      })
    }
  }

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['garantias-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        GarantiasService('garantias').getGarantiasPaginated({
          pageNumber: page + 1,
          pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetGarantias = () => {
  return useQuery({
    queryKey: ['garantias'],
    queryFn: () => GarantiasService('garantias').getGarantias(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetGarantiasCount = () => {
  return useQuery({
    queryKey: ['garantias-count'],
    queryFn: async () => {
      const response = await GarantiasService('garantias').getGarantias()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetGarantiasSelect = () => {
  return useQuery({
    queryKey: ['garantias-select'],
    queryFn: async () => {
      const response = await GarantiasService('garantias').getGarantias()
      const data = response.info.data || []
      return data.sort((a, b) => a.designacao.localeCompare(b.designacao))
    },
    staleTime: 30000,
  })
}

export const useGetGarantia = (id: string) => {
  return useQuery({
    queryKey: ['garantia', id],
    queryFn: async () => {
      const response = await GarantiasService('garantias').getGarantia(id)
      return response.info.data
    },
    enabled: !!id,
  })
}


