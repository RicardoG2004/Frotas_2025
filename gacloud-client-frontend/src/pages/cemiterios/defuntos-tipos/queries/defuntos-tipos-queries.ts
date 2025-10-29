import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DefuntosTiposService } from '@/lib/services/cemiterios/defuntos-tipos-service'

export const useGetDefuntosTiposPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'defuntos-tipos-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      DefuntosTiposService('defunto-tipo').getDefuntosTiposPaginated({
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

export const usePrefetchAdjacentDefuntosTipos = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'defuntos-tipos-paginated',
          page - 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          DefuntosTiposService('defunto-tipo').getDefuntosTiposPaginated({
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
      queryKey: ['defuntos-tipos-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        DefuntosTiposService('defunto-tipo').getDefuntosTiposPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetDefuntosTipos = () => {
  return useQuery({
    queryKey: ['defuntos-tipos'],
    queryFn: () => DefuntosTiposService('defunto-tipo').getDefuntosTipos(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetDefuntoTipo = (id: string) => {
  return useQuery({
    queryKey: ['defunto-tipo', id],
    queryFn: () => DefuntosTiposService('defunto-tipo').getDefuntoTipo(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetDefuntosTiposCount = () => {
  return useQuery({
    queryKey: ['defuntos-tipos-count'],
    queryFn: async () => {
      const response =
        await DefuntosTiposService('defunto-tipo').getDefuntosTipos()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetDefuntosTiposSelect = () => {
  return useQuery({
    queryKey: ['defuntos-tipos-select'],
    queryFn: async () => {
      const response =
        await DefuntosTiposService('defunto-tipo').getDefuntosTipos()
      const data = response.info.data || []
      return data.sort((a, b) =>
        (a.descricao || '').localeCompare(b.descricao || '')
      )
    },
    staleTime: 30000,
  })
}
