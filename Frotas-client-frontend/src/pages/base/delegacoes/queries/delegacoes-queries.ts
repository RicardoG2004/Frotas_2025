import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DelegacoesService } from '@/lib/services/base/delegacoes-service'

export const useGetDelegacoesPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['delegacoes-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      DelegacoesService('delegacoes').getDelegacoesPaginated({
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

export const usePrefetchAdjacentDelegacoes = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['delegacoes-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          DelegacoesService('delegacoes').getDelegacoesPaginated({
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
      queryKey: ['delegacoes-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        DelegacoesService('delegacoes').getDelegacoesPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetDelegacoes = () => {
  return useQuery({
    queryKey: ['delegacoes'],
    queryFn: () => DelegacoesService('delegacoes').getDelegacoes(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetDelegacoesCount = () => {
  return useQuery({
    queryKey: ['delegacoes-count'],
    queryFn: async () => {
      const response = await DelegacoesService('delegacoes').getDelegacoes()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetDelegacoesSelect = () => {
  return useQuery({
    queryKey: ['delegacoes-select'],
    queryFn: async () => {
      const response = await DelegacoesService('delegacoes').getDelegacoes()
      const data = response.info.data || []
      return data.sort((a, b) => a.designacao.localeCompare(b.designacao))
    },
    staleTime: 30000,
  })
}

export const useGetDelegacao = (id: string) => {
  return useQuery({
    queryKey: ['delegacoes', id],
    queryFn: async () => {
      const response = await DelegacoesService('delegacoes').getDelegacao(id)
      return response.info?.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

