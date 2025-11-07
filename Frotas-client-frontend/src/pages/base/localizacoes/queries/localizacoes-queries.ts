import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LocalizacoesService } from '@/lib/services/base/localizacoes-service'

export const useGetLocalizacoesPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'localizacoes-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      LocalizacoesService('localizacoes').getLocalizacoesPaginated({
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

export const usePrefetchAdjacentLocalizacoes = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'localizacoes-paginated',
          page - 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          LocalizacoesService('localizacoes').getLocalizacoesPaginated({
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
      queryKey: ['localizacoes-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        LocalizacoesService('localizacoes').getLocalizacoesPaginated({
          pageNumber: page + 1,
          pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetLocalizacoes = () => {
  return useQuery({
    queryKey: ['localizacoes'],
    queryFn: () =>
      LocalizacoesService('localizacoes').getLocalizacoes(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetLocalizacoesCount = () => {
  return useQuery({
    queryKey: ['localizacoes-count'],
    queryFn: async () => {
      const response = await LocalizacoesService(
        'localizacoes'
      ).getLocalizacoes()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetLocalizacoesSelect = () => {
  return useQuery({
    queryKey: ['localizacoes-select'],
    queryFn: async () => {
      const response = await LocalizacoesService(
        'localizacoes'
      ).getLocalizacoes()
      const data = response.info.data || []
      return data
        .filter((item) => !!item.designacao)
        .sort((a, b) => a.designacao.localeCompare(b.designacao))
    },
    staleTime: 30 * 1000,
  })
}

export const useGetLocalizacao = (id: string) => {
  return useQuery({
    queryKey: ['localizacao', id],
    queryFn: async () => {
      const response = await LocalizacoesService(
        'localizacoes'
      ).getLocalizacao(id)
      return response.info.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

