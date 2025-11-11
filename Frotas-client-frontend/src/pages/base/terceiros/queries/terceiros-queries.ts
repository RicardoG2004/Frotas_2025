import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TerceirosService } from '@/lib/services/base/terceiros-service'

export const useGetTerceirosPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  const normalizedFilters =
    filters && filters.length > 0
      ? filters
      : [
          {
            id: 'nome',
            value: '',
          },
        ]

  return useQuery({
    queryKey: ['terceiros-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      TerceirosService('terceiros').getTerceirosPaginated({
        pageNumber,
        pageSize: pageLimit,
        filters: normalizedFilters.map((filter) => ({
          id: filter.id,
          value: filter.value ?? '',
        })),
        sorting: sorting ?? undefined,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentTerceiros = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const normalizedFilters =
    filters && filters.length > 0
      ? filters
      : [
          {
            id: 'nome',
            value: '',
          },
        ]

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['terceiros-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          TerceirosService('terceiros').getTerceirosPaginated({
            pageNumber: page - 1,
            pageSize,
            filters: normalizedFilters.map((filter) => ({
              id: filter.id,
              value: filter.value ?? '',
            })),
            sorting: undefined,
          }),
      })
    }
  }

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['terceiros-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        TerceirosService('terceiros').getTerceirosPaginated({
          pageNumber: page + 1,
          pageSize,
          filters: normalizedFilters.map((filter) => ({
            id: filter.id,
            value: filter.value ?? '',
          })),
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetTerceiros = () => {
  return useQuery({
    queryKey: ['terceiros'],
    queryFn: () => TerceirosService('terceiros').getTerceiros(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetTerceirosCount = () => {
  return useQuery({
    queryKey: ['terceiros-count'],
    queryFn: async () => {
      const response = await TerceirosService('terceiros').getTerceiros()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetTerceiro = (id: string) => {
  return useQuery({
    queryKey: ['terceiros', id],
    queryFn: async () => {
      const response = await TerceirosService('terceiros').getTerceiro(id)
      return response.info?.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetTerceirosSelect = () => {
  return useQuery({
    queryKey: ['terceiros-select'],
    queryFn: async () => {
      const response = await TerceirosService('terceiros').getTerceiros()
      const data = response.info.data || []
      return data.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''))
    },
    staleTime: 30000,
  })
}


