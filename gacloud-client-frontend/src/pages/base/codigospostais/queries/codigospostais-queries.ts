import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CodigosPostaisService } from '@/lib/services/base/codigospostais-service'

export const useGetCodigosPostaisPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'codigospostais-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      CodigosPostaisService('codigospostais').getCodigosPostaisPaginated({
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

export const usePrefetchAdjacentCodigosPostais = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'codigospostais-paginated',
          page - 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          CodigosPostaisService('codigospostais').getCodigosPostaisPaginated({
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
      queryKey: ['codigospostais-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        CodigosPostaisService('codigospostais').getCodigosPostaisPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetCodigosPostais = () => {
  return useQuery({
    queryKey: ['codigospostais'],
    queryFn: () => CodigosPostaisService('codigospostais').getCodigosPostais(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetCodigosPostaisCount = () => {
  return useQuery({
    queryKey: ['codigospostais-count'],
    queryFn: async () => {
      const response =
        await CodigosPostaisService('codigospostais').getCodigosPostais()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetCodigosPostaisSelect = () => {
  return useQuery({
    queryKey: ['codigospostais-select'],
    queryFn: async () => {
      const response =
        await CodigosPostaisService('freguesias').getCodigosPostais()
      const data = response.info.data || []
      return data.sort((a, b) => a.codigo.localeCompare(b.codigo))
    },
    staleTime: 30000,
  })
}

export const useGetCodigoPostal = (id: string) => {
  return useQuery({
    queryKey: ['codigoPostal', id],
    queryFn: async () => {
      const response =
        await CodigosPostaisService('codigospostais').getCodigoPostal(id)
      return response.info.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
