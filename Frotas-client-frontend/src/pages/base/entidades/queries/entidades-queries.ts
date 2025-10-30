import { useQuery, useQueryClient } from '@tanstack/react-query'
import { EntidadesService } from '@/lib/services/base/entidades-service'

export const useGetEntidadesPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['entidades-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      EntidadesService('entidades').getEntidadesPaginated({
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

export const usePrefetchAdjacentEntidades = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['entidades-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          EntidadesService('entidades').getEntidadesPaginated({
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
      queryKey: ['entidades-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        EntidadesService('entidades').getEntidadesPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetEntidades = () => {
  return useQuery({
    queryKey: ['entidades'],
    queryFn: () => EntidadesService('entidades').getEntidades(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetEntidadesCount = () => {
  return useQuery({
    queryKey: ['entidades-count'],
    queryFn: async () => {
      const response = await EntidadesService('entidades').getEntidades()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetEntidadesSelect = () => {
  return useQuery({
    queryKey: ['entidades-select'],
    queryFn: async () => {
      const response = await EntidadesService('entidades').getEntidades()
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}

export const useGetEntidade = (id: string) => {
  return useQuery({
    queryKey: ['entidade', id],
    queryFn: () => EntidadesService('entidades').getEntidade(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
