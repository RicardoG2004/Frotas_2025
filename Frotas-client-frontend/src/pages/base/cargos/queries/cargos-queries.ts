import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CargosService } from '@/lib/services/base/cargos-service'

export const useGetCargosPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  return useQuery({
    queryKey: ['cargos-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      CargosService('cargos').getCargosPaginated({
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

export const usePrefetchAdjacentCargos = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['cargos-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          CargosService('cargos').getCargosPaginated({
            pageNumber: page - 1,
            pageSize,
            filters: (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined,
          }),
      })
    }
  }

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['cargos-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        CargosService('cargos').getCargosPaginated({
          pageNumber: page + 1,
          pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetCargos = () => {
  return useQuery({
    queryKey: ['cargos'],
    queryFn: () => CargosService('cargos').getCargos(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetCargo = (id: string) => {
  return useQuery({
    queryKey: ['cargo', id],
    queryFn: async () => {
      const response = await CargosService('cargos').getCargo(id)
      return response.info?.data
    },
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetCargosCount = () => {
  return useQuery({
    queryKey: ['cargos-count'],
    queryFn: async () => {
      const response = await CargosService('cargos').getCargos()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetCargosSelect = () => {
  return useQuery({
    queryKey: ['cargos-select'],
    queryFn: async () => {
      const response = await CargosService('cargos').getCargos()
      const data = response.info.data || []
      return data.sort((a, b) => a.designacao.localeCompare(b.designacao))
    },
    staleTime: 30000,
  })
}


