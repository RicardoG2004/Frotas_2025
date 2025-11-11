import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ViaturasService } from '@/lib/services/frotas/viaturas-service'

const DEFAULT_FILTERS = [{ id: 'matricula', value: '' }]

export const useGetViaturasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  const buildFiltersPayload = () => {
    const activeFilters = filters?.length ? filters : DEFAULT_FILTERS

    return activeFilters.map((filter) => ({
      id: filter.id,
      value: filter.value ?? '',
    }))
  }

  return useQuery({
    queryKey: ['viaturas-paginated', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      ViaturasService('viatura').getViaturasPaginated({
        pageNumber,
        pageSize: pageLimit,
        filters: buildFiltersPayload(),
        sorting: sorting ?? undefined,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const usePrefetchAdjacentViaturas = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const buildFiltersPayload = () => {
    const activeFilters = filters?.length ? filters : DEFAULT_FILTERS

    return activeFilters.map((filter) => ({
      id: filter.id,
      value: filter.value ?? '',
    }))
  }

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['viaturas-paginated', page - 1, pageSize, filters, null],
        queryFn: () =>
          ViaturasService('viatura').getViaturasPaginated({
            pageNumber: page - 1,
            pageSize,
            filters: buildFiltersPayload(),
            sorting: undefined,
          }),
      })
    }
  }

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['viaturas-paginated', page + 1, pageSize, filters, null],
      queryFn: () =>
        ViaturasService('viatura').getViaturasPaginated({
          pageNumber: page + 1,
          pageSize,
          filters: buildFiltersPayload(),
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetViaturas = () => {
  return useQuery({
    queryKey: ['viaturas'],
    queryFn: () => ViaturasService('viatura').getViaturas(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetViatura = (id: string) => {
  return useQuery({
    queryKey: ['viatura', id],
    queryFn: () => ViaturasService('viatura').getViatura(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetViaturasCount = () => {
  return useQuery({
    queryKey: ['viaturas-count'],
    queryFn: async () => {
      const response = await ViaturasService('viatura').getViaturas()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetViaturasSelect = () => {
  return useQuery({
    queryKey: ['viaturas-select'],
    queryFn: async () => {
      const response = await ViaturasService('viatura').getViaturas()
      const data = response.info.data || []
      return data.sort((a, b) =>
        (a.matricula || '').localeCompare(b.matricula || '')
      )
    },
    staleTime: 30000,
  })
}

