import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CemiteriosService } from '@/lib/services/cemiterios/cemiterios-service'

export const useGetCemiteriosPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['cemiterios-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      CemiteriosService('cemiterios').getCemiteriosPaginated({
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

export const usePrefetchAdjacentCemiterios = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['cemiterios-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          CemiteriosService('cemiterios').getCemiteriosPaginated({
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
      queryKey: ['cemiterios-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        CemiteriosService('cemiterios').getCemiteriosPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetCemiterios = () => {
  return useQuery({
    queryKey: ['cemiterios'],
    queryFn: () => CemiteriosService('cemiterios').getCemiterios(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetCemiterio = (id: string) => {
  return useQuery({
    queryKey: ['cemiterio', id],
    queryFn: () => CemiteriosService('cemiterios').getCemiterio(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetCemiteriosCount = () => {
  return useQuery({
    queryKey: ['cemiterios-count'],
    queryFn: async () => {
      const response = await CemiteriosService('cemiterios').getCemiterios()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetCemiteriosSelect = () => {
  return useQuery({
    queryKey: ['cemiterios-select'],
    queryFn: async () => {
      const response = await CemiteriosService('cemiterios').getCemiterios()
      const data = response.info.data || []
      return data.sort((a, b) => a.nome.localeCompare(b.nome))
    },
    staleTime: 30000,
  })
}

export const useGetCemiterioSvg = (id: string) => {
  return useQuery({
    queryKey: ['cemiterio-svg', id],
    queryFn: () => CemiteriosService('cemiterios').getCemiterioSvg(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetPredefinedCemiterio = () => {
  return useQuery({
    queryKey: ['cemiterio-predefined'],
    queryFn: () => CemiteriosService('cemiterios').getPredefinedCemiterio(),
    enabled: false, // This query won't run automatically
  })
}
