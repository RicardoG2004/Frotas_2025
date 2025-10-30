import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ConcelhosService } from '@/lib/services/base/concelhos-service'

export const useGetConcelhosPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['concelhos-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      ConcelhosService('concelhos').getConcelhosPaginated({
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

export const usePrefetchAdjacentConcelhos = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['concelhos-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          ConcelhosService('concelhos').getConcelhosPaginated({
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
      queryKey: ['concelhos-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        ConcelhosService('concelhos').getConcelhosPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetConcelhos = () => {
  return useQuery({
    queryKey: ['concelhos'],
    queryFn: () => ConcelhosService('concelhos').getConcelhos(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetConcelhosCount = () => {
  return useQuery({
    queryKey: ['concelhos-count'],
    queryFn: async () => {
      const response = await ConcelhosService('concelhos').getConcelhos()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetConcelhosSelect = () => {
  return useQuery({
    queryKey: ['concelhos-select'],
    queryFn: async () => {
      const response = await ConcelhosService('concelhos').getConcelhos()
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}

export const useGetConcelho = (id: string) => {
  return useQuery({
    queryKey: ['concelho', id],
    queryFn: async () => {
      const response = await ConcelhosService('concelhos').getConcelho(id)
      return response.info?.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
