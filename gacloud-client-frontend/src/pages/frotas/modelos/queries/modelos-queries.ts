import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ModelosService } from '@/lib/services/frotas/modelos-service'
import { ModeloDTO } from '@/types/dtos/frotas/modelos.dtos'

export const useGetModelosPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['modelos-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      ModelosService('modelo').getModelosPaginated({
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

export const usePrefetchAdjacentModelos = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['modelos-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          ModelosService('modelo').getModelosPaginated({
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
      queryKey: ['modelos-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        ModelosService('modelo').getModelosPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetModelos = () => {
  return useQuery({
    queryKey: ['modelos'],
    queryFn: () => ModelosService('modelo').getModelos(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetModelo = (id: string) => {
  return useQuery({
    queryKey: ['modelo', id],
    queryFn: () => ModelosService('modelo').getModelo(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetModelosCount = () => {
  return useQuery({
    queryKey: ['modelos-count'],
    queryFn: async () => {
      const response = await ModelosService('modelo').getModelos()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetModelosSelect = () => {
  return useQuery({
    queryKey: ['modelos-select'],
    queryFn: async () => {
      const response = await ModelosService('modelo').getModelos()
      const data = response.info.data || []
      return data.sort((a: ModeloDTO, b: ModeloDTO) => (a.nome || '').localeCompare(b.nome || ''))
    },
    staleTime: 30000,
  })
}
