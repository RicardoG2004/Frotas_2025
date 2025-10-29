import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CoveirosService } from '@/lib/services/cemiterios/coveiros-service'

export const useGetCoveirosPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['coveiros-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      CoveirosService('coveiro').getCoveirosPaginated({
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

export const usePrefetchAdjacentCoveiros = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['coveiros-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          CoveirosService('coveiro').getCoveirosPaginated({
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
      queryKey: ['coveiros-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        CoveirosService('coveiro').getCoveirosPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetCoveiros = () => {
  return useQuery({
    queryKey: ['coveiros'],
    queryFn: () => CoveirosService('coveiro').getCoveiros(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetCoveiro = (id: string) => {
  return useQuery({
    queryKey: ['coveiro', id],
    queryFn: () => CoveirosService('coveiro').getCoveiro(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetCoveirosCount = () => {
  return useQuery({
    queryKey: ['coveiros-count'],
    queryFn: async () => {
      const response = await CoveirosService('coveiro').getCoveiros()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetCoveirosSelect = () => {
  return useQuery({
    queryKey: ['coveiros-select'],
    queryFn: async () => {
      const response = await CoveirosService('coveiro').getCoveiros()
      const data = response.info.data || []
      return data.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''))
    },
    staleTime: 30000,
  })
}
