import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ServicosService } from '@/lib/services/frotas/servicos-service'

export const useGetServicosPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: [
      'servicos-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      ServicosService(
        'servico'
      ).getServicosPaginated({
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

export const usePrefetchAdjacentServicos = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'servicos-paginated',
          page - 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          ServicosService(
            'servico'
          ).getServicosPaginated({
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
        'servicos-paginated',
        page + 1,
        pageSize,
        filters,
        null,
      ],
      queryFn: () =>
        ServicosService(
          'servico'
        ).getServicosPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetServicos = () => {
  return useQuery({
    queryKey: ['servicos'],
    queryFn: () =>
      ServicosService('servico').getServicos(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetServico = (id: string) => {
  return useQuery({
    queryKey: ['servico', id],
    queryFn: () =>
      ServicosService('servico').getServico(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetServicosCount = () => {
  return useQuery({
    queryKey: ['servicos-count'],
    queryFn: async () => {
      const response =
        await ServicosService(
          'servico'
        ).getServicos()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetServicosSelect = () => {
  return useQuery({
    queryKey: ['servicos-select'],
    queryFn: async () => {
      const response =
        await ServicosService(
          'servico'
        ).getServicos()
      const data = response.info.data || []
      return data.sort((a, b) =>
        (a.designacao || '').localeCompare(b.designacao || '')
      )
    },
    staleTime: 30000,
  })
}

