import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CombustiveisService } from '@/lib/services/frotas/combustiveis-service'
import { CombustivelDTO } from '@/types/dtos/frotas/combustiveis.dtos'

export const useGetCombustiveisPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['combustiveis-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      CombustiveisService('combustivel').getCombustiveisPaginated({
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

export const usePrefetchAdjacentCombustiveis = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['combustiveis-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          CombustiveisService('combustivel').getCombustiveisPaginated({
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
      queryKey: ['combustiveis-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        CombustiveisService('combustivel').getCombustiveisPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetCombustiveis = () => {
  return useQuery({
    queryKey: ['combustiveis'],
    queryFn: () => CombustiveisService('combustivel').getCombustiveis(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetCombustivel = (id: string) => {
  return useQuery({
    queryKey: ['combustivel', id],
    queryFn: () => CombustiveisService('combustivel').getCombustivel(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetCombustiveisCount = () => {
  return useQuery({
    queryKey: ['combustiveis-count'],
    queryFn: async () => {
      const response = await CombustiveisService('combustivel').getCombustiveis()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetCombustiveisSelect = () => {
  return useQuery({
    queryKey: ['combustiveis-select'],
    queryFn: async () => {
      const response = await CombustiveisService('combustivel').getCombustiveis()
      const data = response.info.data || []
      return data.sort((a: CombustivelDTO, b: CombustivelDTO) => (a.nome || '').localeCompare(b.nome || ''))
    },
    staleTime: 30000,
  })
}
