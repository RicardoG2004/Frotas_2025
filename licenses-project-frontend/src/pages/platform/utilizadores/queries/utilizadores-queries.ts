import { useQuery, useQueryClient } from '@tanstack/react-query'
import UtilizadoresService from '@/lib/services/platform/utilizadores-service'

export const useGetUtilizadoresPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'utilizadores-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      UtilizadoresService('utilizadores').getUtilizadoresPaginated({
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

export const usePrefetchAdjacentUtilizadores = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['utilizadores-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          UtilizadoresService('utilizadores').getUtilizadoresPaginated({
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
      queryKey: ['utilizadores-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        UtilizadoresService('utilizadores').getUtilizadoresPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetUtilizadores = () => {
  return useQuery({
    queryKey: ['utilizadores'],
    queryFn: () => UtilizadoresService('utilizadores').getUtilizadores(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetUtilizadorById = (id: string) => {
  return useQuery({
    queryKey: ['utilizador', id],
    queryFn: () => UtilizadoresService('utilizadores').getUtilizadorById(id),
    enabled: !!id,
  })
}

export const useGetUtilizadoresCount = () => {
  return useQuery({
    queryKey: ['utilizadores-count'],
    queryFn: async () => {
      const response =
        await UtilizadoresService('utilizadores').getUtilizadores()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => UtilizadoresService('profile').getProfile(),
  })
}
