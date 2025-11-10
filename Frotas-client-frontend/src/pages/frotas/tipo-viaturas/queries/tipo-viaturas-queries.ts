import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TipoViaturasService } from '@/lib/services/frotas/tipo-viaturas-service'

export const useGetTipoViaturasPaginated = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: Array<{ id: string; desc: boolean }> | null
) => {
  const buildFiltersPayload = () => {
    const activeFilters = filters?.length
      ? filters
      : [{ id: 'designacao', value: '' }]

    return activeFilters.map((filter) => ({
      id: filter.id,
      value: filter.value ?? '',
    }))
  }

  return useQuery({
    queryKey: [
      'tipo-viaturas-paginated',
      pageNumber,
      pageLimit,
      filters,
      sorting,
    ],
    queryFn: () =>
      TipoViaturasService('tipoViatura').getTipoViaturasPaginated({
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

export const usePrefetchAdjacentTipoViaturas = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient()

  const buildFiltersPayload = () => {
    const activeFilters = filters?.length
      ? filters
      : [{ id: 'designacao', value: '' }]

    return activeFilters.map((filter) => ({
      id: filter.id,
      value: filter.value ?? '',
    }))
  }

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: [
          'tipo-viaturas-paginated',
          page - 1,
          pageSize,
          filters,
          null,
        ],
        queryFn: () =>
          TipoViaturasService('tipoViatura').getTipoViaturasPaginated({
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
      queryKey: [
        'tipo-viaturas-paginated',
        page + 1,
        pageSize,
        filters,
        null,
      ],
      queryFn: () =>
        TipoViaturasService('tipoViatura').getTipoViaturasPaginated({
          pageNumber: page + 1,
          pageSize,
          filters: buildFiltersPayload(),
          sorting: undefined,
        }),
    })
  }

  return { prefetchPreviousPage, prefetchNextPage }
}

export const useGetTipoViaturas = () => {
  return useQuery({
    queryKey: ['tipo-viaturas'],
    queryFn: () => TipoViaturasService('tipoViatura').getTipoViaturas(),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetTipoViatura = (id: string) => {
  return useQuery({
    queryKey: ['tipo-viatura', id],
    queryFn: () => TipoViaturasService('tipoViatura').getTipoViatura(id),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export const useGetTipoViaturasCount = () => {
  return useQuery({
    queryKey: ['tipo-viaturas-count'],
    queryFn: async () => {
      const response = await TipoViaturasService(
        'tipoViatura'
      ).getTipoViaturas()
      return response.info?.data?.length || 0
    },
  })
}

export const useGetTipoViaturasSelect = () => {
  return useQuery({
    queryKey: ['tipo-viaturas-select'],
    queryFn: async () => {
      const response = await TipoViaturasService(
        'tipoViatura'
      ).getTipoViaturas()
      const data = response.info.data || []
      return data.sort((a, b) =>
        (a.designacao || '').localeCompare(b.designacao || '')
      )
    },
    staleTime: 30000,
  })
}

