import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SeguradorasService } from '@/lib/services/frotas/seguradoras-service'

export const useGetSeguradorasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'seguradoras-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      SeguradorasService('seguradora').getSeguradorasPaginated({
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

export const usePrefetchAdjacentSeguradoras = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['seguradoras-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          SeguradorasService('seguradora').getSeguradorasPaginated({
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
      queryKey: ['seguradoras-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        SeguradorasService('seguradora').getSeguradorasPaginated({
          pageNumber: page + 1,
          pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetSeguradoras = () => {
  return useQuery({
    queryKey: ['seguradoras'],
    queryFn: () => SeguradorasService('seguradora').getSeguradoras(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetSeguradora = (id: string) => {
  return useQuery({
    queryKey: ['seguradora', id],
    queryFn: () => SeguradorasService('seguradora').getSeguradora(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetSeguradorasCount = () => {
  return useQuery({
    queryKey: ['seguradoras-count'],
    queryFn: async () => {
      const response = await SeguradorasService('seguradora').getSeguradoras()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetSeguradorasSelect = () => {
  return useQuery({
    queryKey: ['seguradoras-select'],
    queryFn: async () => {
      const response = await SeguradorasService('seguradora').getSeguradoras()
      const data = response.info.data || []
      return data.sort((a, b) =>
        (a.descricao || '').localeCompare(b.descricao || '')
      )
    },
    staleTime: 30000,
  })
}


