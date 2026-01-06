import { useQuery, useQueryClient } from '@tanstack/react-query'
import AplicacoesService from '@/lib/services/application/aplicacoes-service'
import AreasService from '@/lib/services/application/areas-service'

export const useGetAplicacoesPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['aplicacoes-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      AplicacoesService('aplicacoes').getAplicacoesPaginated({
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

export const usePrefetchAdjacentAplicacoes = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['aplicacoes-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          AplicacoesService('aplicacoes').getAplicacoesPaginated({
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
      queryKey: ['aplicacoes-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        AplicacoesService('aplicacoes').getAplicacoesPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetAplicacoes = () => {
  return useQuery({
    queryKey: ['aplicacoes'],
    queryFn: () => AplicacoesService('aplicacoes').getAplicacoes(),
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

export const useGetAplicacoesCount = () => {
  return useQuery({
    queryKey: ['aplicacoes-count'],
    queryFn: async () => {
      const response = await AplicacoesService('aplicacoes').getAplicacoes()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetAplicacoesSelect = () => {
  return useQuery({
    queryKey: ['aplicacoes-select'],
    queryFn: async () => {
      const response = await AplicacoesService('aplicacoes').getAplicacoes()
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}
