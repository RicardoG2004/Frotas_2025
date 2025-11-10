import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SegurosService } from '@/lib/services/frotas/seguros-service'

export const useGetSegurosPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['seguros-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      SegurosService('seguro').getSegurosPaginated({
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

export const usePrefetchAdjacentSeguros = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['seguros-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          SegurosService('seguro').getSegurosPaginated({
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
      queryKey: ['seguros-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        SegurosService('seguro').getSegurosPaginated({
          pageNumber: page + 1,
          pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetSeguros = () => {
  return useQuery({
    queryKey: ['seguros'],
    queryFn: () => SegurosService('seguro').getSeguros(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetSeguro = (id: string) => {
  return useQuery({
    queryKey: ['seguro', id],
    queryFn: () => SegurosService('seguro').getSeguro(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetSegurosCount = () => {
  return useQuery({
    queryKey: ['seguros-count'],
    queryFn: async () => {
      const response = await SegurosService('seguro').getSeguros()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetSegurosSelect = () => {
  return useQuery({
    queryKey: ['seguros-select'],
    queryFn: async () => {
      const response = await SegurosService('seguro').getSeguros()
      const data = response.info.data || []
      return data.sort((a, b) =>
        (a.designacao || '').localeCompare(b.designacao || '')
      )
    },
    staleTime: 30000,
  })
}


