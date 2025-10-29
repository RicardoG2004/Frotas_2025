import { useQuery, useQueryClient } from '@tanstack/react-query'
import AreasService from '@/lib/services/application/areas-service'

export const useGetAreasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['areas-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      AreasService('areas').getAreasPaginated({
        pageNumber: pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting:
          (sorting as unknown as Array<{ id: string; desc: boolean }>) ??
          undefined,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentAreas = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['areas-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          AreasService('areas').getAreasPaginated({
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
      queryKey: ['areas-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        AreasService('areas').getAreasPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetAreas = () => {
  return useQuery({
    queryKey: ['areas'],
    queryFn: () => AreasService('areas').getAreas(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetAreasSelect = () => {
  return useQuery({
    queryKey: ['areas-select'],
    queryFn: async () => {
      const response = await AreasService('areas').getAreas()
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}

export const useGetAreasCount = () => {
  return useQuery({
    queryKey: ['areas-count'],
    queryFn: async () => {
      const response = await AreasService('areas').getAreas()
      return response.info?.data?.length || 0
    },
  })
}
