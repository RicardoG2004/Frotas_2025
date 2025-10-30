import { useQuery, useQueryClient } from '@tanstack/react-query'
import { RuasService } from '@/lib/services/base/ruas-service'

export const useGetRuasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['ruas-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      RuasService('ruas').getRuasPaginated({
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

export const usePrefetchAdjacentRuas = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['ruas-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          RuasService('ruas').getRuasPaginated({
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
      queryKey: ['ruas-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        RuasService('ruas').getRuasPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetRuas = () => {
  return useQuery({
    queryKey: ['ruas'],
    queryFn: () => RuasService('ruas').getRuas(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetRuasCount = () => {
  return useQuery({
    queryKey: ['ruas-count'],
    queryFn: async () => {
      const response = await RuasService('ruas').getRuas()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetRuasSelect = () => {
  return useQuery({
    queryKey: ['ruas-select'],
    queryFn: async () => {
      const response = await RuasService('ruas').getRuas()
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}

export const useGetRua = (id: string) => {
  return useQuery({
    queryKey: ['rua', id],
    queryFn: () => RuasService('ruas').getRua(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
