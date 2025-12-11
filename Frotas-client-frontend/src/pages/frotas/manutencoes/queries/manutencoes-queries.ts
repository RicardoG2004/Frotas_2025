import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ManutencoesService } from '@/lib/services/frotas/manutencoes-service'

export const useGetManutencoesPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'manutencoes-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      ManutencoesService(
        'manutencao'
      ).getManutencoesPaginated({
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

export const usePrefetchAdjacentManutencoes = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'manutencoes-paginated',
          page - 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          ManutencoesService(
            'manutencao'
          ).getManutencoesPaginated({
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
      queryKey: [
        'manutencoes-paginated',
        page + 1,
        pageSize,
        filters,
        null,
      ],
      queryFn: () =>
        ManutencoesService(
          'manutencao'
        ).getManutencoesPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetManutencoes = () => {
  return useQuery({
    queryKey: ['manutencoes'],
    queryFn: () =>
      ManutencoesService('manutencao').getManutencoes(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetManutencao = (id: string) => {
  return useQuery({
    queryKey: ['manutencao', id],
    queryFn: () =>
      ManutencoesService('manutencao').getManutencao(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetManutencoesCount = () => {
  return useQuery({
    queryKey: ['manutencoes-count'],
    queryFn: async () => {
      const response =
        await ManutencoesService(
          'manutencao'
        ).getManutencoes()
      return response.info?.data?.length || 0
    },
  })
}

