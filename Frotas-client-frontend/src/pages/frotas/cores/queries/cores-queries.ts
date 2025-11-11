import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CoresService } from '@/lib/services/frotas/cores-service'

export const useGetCoresPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['cores-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      CoresService('cores').getCoresPaginated({
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

export const usePrefetchAdjacentCores = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['cores-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          CoresService('cores').getCoresPaginated({
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
      queryKey: ['cores-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        CoresService('cores').getCoresPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetCores = () => {
  return useQuery({
    queryKey: ['cores'],
    queryFn: () => CoresService('cores').getCores(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetCoresCount = () => {
  return useQuery({
    queryKey: ['cores-count'],
    queryFn: async () => {
      const response = await CoresService('cores').getCores()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetCoresSelect = () => {
  return useQuery({
    queryKey: ['cores-select'],
    queryFn: async () => {
      const response = await CoresService('cores').getCores()
      const data = response.info.data || []
      return data.sort((a, b) => a.designacao.localeCompare(b.designacao))
    },
    staleTime: 30000,
  })
}

export const useGetCor = (id: string) => {
  return useQuery({
    queryKey: ['cor', id],
    queryFn: async () => {
      const response = await CoresService('cores').getCor(id)
      return response.info.data
    },
    enabled: !!id,
  })
}

