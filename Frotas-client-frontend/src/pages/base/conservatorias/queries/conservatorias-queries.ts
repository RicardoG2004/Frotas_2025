import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ConservatoriasService } from '@/lib/services/base/conservatorias-service'

export const useGetConservatoriasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['conservatorias-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      ConservatoriasService('conservatorias').getConservatoriasPaginated({
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

export const usePrefetchAdjacentConservatorias = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['conservatorias-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          ConservatoriasService('conservatorias').getConservatoriasPaginated({
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
      queryKey: ['conservatorias-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        ConservatoriasService('conservatorias').getConservatoriasPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetConservatorias = () => {
  return useQuery({
    queryKey: ['conservatorias'],
    queryFn: () => ConservatoriasService('conservatorias').getConservatorias(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetConservatoriasCount = () => {
  return useQuery({
    queryKey: ['conservatorias-count'],
    queryFn: async () => {
      const response = await ConservatoriasService('conservatorias').getConservatorias()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetConservatoriasSelect = () => {
  return useQuery({
    queryKey: ['conservatorias-select'],
    queryFn: async () => {
      const response = await ConservatoriasService('conservatorias').getConservatorias()
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}

export const useGetConservatoria = (id: string) => {
  return useQuery({
    queryKey: ['conservatorias', id],
    queryFn: async () => {
      const response = await ConservatoriasService('conservatorias').getConservatoria(id)
      return response.info?.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

